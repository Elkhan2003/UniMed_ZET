import React, { useState, useEffect } from 'react';
import {
  Flex,
  notification,
  Spin,
  Alert,
  Button,
} from 'antd';
import { useParams } from 'react-router-dom';
import {
  useGetMasterPrivilagesQuery,
  usePutMasterPrivilagesMutation,
} from '../../../../../../../store/services/master.service';
import { Switch } from '../../../../../../../components/shared/switch';

interface Privileges {
  id?: number;
  canChangeAvatar: boolean;
  canViewClientCard: boolean;
  canSeeClientPhone: boolean;
  canAcceptPayments: boolean;
  canAddClients: boolean;
  canGiveDiscounts: boolean;
  canCreateAppointments: boolean;
  canCancelAppointments: boolean;
  canChangeAppointmentStatus: boolean;
  canRescheduleAppointmentTimes?: boolean;
  canRescheduleAppointments?: boolean;
  canAddServices?: boolean;
  canEditServices?: boolean;
  canChangeVisitTime?: boolean;
  canChangeAppointmentDuration?: boolean;
  [key: string]: boolean | number | undefined;
}

interface PrivilegeCategory {
  title: string;
  keys: Array<keyof Omit<Privileges, 'id'>>;
}

// Translation map for privilege keys
const translationMap: Record<string, string> = {
  canViewClientCard: 'Возможность просмотра карточки клиента',
  canSeeClientPhone: 'Возможность просмотра тел. номера клиента',
  canAcceptPayments: 'Возможность принимать оплату',
  canAddClients: 'Возможность добавлять новых клиентов',
  canGiveDiscounts: 'Возможность давать скидку',
  canCreateAppointments: 'Возможность создавать записи',
  canCancelAppointments: 'Возможность отменять записи',
  canChangeAppointmentStatus: 'Возможность менять статус своих записей',
  canRescheduleAppointmentTimes: 'Возможность изменить время уже записанного визита',
  canRescheduleAppointments: 'Возможность переносить записи',
  canAddServices: 'Возможность добавлять услуги',
  canEditServices: 'Возможность редактировать услуги',
  canChangeVisitTime: 'Возможность изменять время визита',
  canChangeAppointmentDuration: 'Возможность изменять продолжительность записи',
  canChangeAvatar: 'Возможность изменять фото профиля',
};

const privilegeCategories: PrivilegeCategory[] = [
  {
    title: 'Доступ к клиентам',
    keys: ['canViewClientCard', 'canSeeClientPhone', 'canAddClients'],
  },
  {
    title: 'Доступ к записям',
    keys: [
      'canCreateAppointments',
      'canChangeAppointmentStatus',
      'canCancelAppointments',
      'canRescheduleAppointmentTimes',
      'canRescheduleAppointments',
      'canChangeVisitTime',
      'canChangeAppointmentDuration',
      'canAcceptPayments',
      'canGiveDiscounts',
    ],
  },
  {
    title: 'Доступ к аватарке',
    keys: ['canChangeAvatar'],
  },
];

const MasterPrivilegesPage: React.FC = () => {
  const { masterID } = useParams<{ masterID: string }>();
  const [localPrivileges, setLocalPrivileges] = useState<Privileges | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    data: privileges,
    isLoading,
    error: fetchError,
    refetch,
  } = useGetMasterPrivilagesQuery(masterID);

  const [updatePrivileges, { isLoading: isUpdating, error: updateError }] =
    usePutMasterPrivilagesMutation();

  // Initialize local state with fetched data
  useEffect(() => {
    if (privileges && !localPrivileges) {
      setLocalPrivileges(privileges);
    }
  }, [privileges, localPrivileges]);

  // Handle toggle with debounced save
  const handleToggle = (key: string, value: boolean) => {
    if (!localPrivileges) return;

    setLocalPrivileges(prev => prev ? {
      ...prev,
      [key]: value,
    } : null);

    // Clear previous timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set new timeout for debounced save
    const timeoutId = setTimeout(() => {
      handleSave();
    }, 500);
    
    setSaveTimeout(timeoutId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  const handleSave = async () => {
    if (!localPrivileges || !masterID) return;

    try {
      await updatePrivileges({
        masterId: masterID,
        body: localPrivileges,
      }).unwrap();

      // notification.success({
      //   message: 'Успех',
      //   description: 'Права доступа успешно обновлены',
      // });
    } catch (err) {
      console.error('Error updating privileges:', err);
      // notification.error({
      //   message: 'Ошибка',
      //   description: 'Не удалось обновить права доступа',
      // });
    }
  };

  // Handle loading state
  if (isLoading && !localPrivileges) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: '300px' }}>
        <Spin size="large" tip="Загрузка..." />
      </Flex>
    );
  }

  const errorMessage = fetchError
    ? 'Не удалось загрузить права доступа'
    : updateError
      ? 'Не удалось обновить права доступа'
      : null;

  // Privilege toggle component
  const PrivilegeToggle = ({ privilegeKey }: { privilegeKey: string }) => {
    if (!localPrivileges) return null;

    const value = Boolean(localPrivileges[privilegeKey]);
    const label = translationMap[privilegeKey] || privilegeKey;

    return (
      <Flex key={privilegeKey} justify="space-between" align="center">
        <p className="text-[#101010] text-[14px]">{label}</p>
        <Switch
          active={value}
          setActive={(checked: boolean) => handleToggle(privilegeKey, checked)}
          onClick={() => false}
        //   disabled={isUpdating}
        />
      </Flex>
    );
  };

  return (
    <Flex vertical gap="medium" className="w-full">
      {/* Error message */}
      {errorMessage && (
        <Alert
          message={errorMessage}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={fetchError ? <Button onClick={refetch}>Попробовать снова</Button> : undefined}
          closable
        />
      )}
      {localPrivileges &&
        privilegeCategories.map((category, index) => (
          <Flex vertical gap="small" key={index} className="w-full mb-8">
            <p className="text-[#4E4E4E80] text-[14px]">{category.title}</p>
            {category.keys
              .filter((key) => 
                Object.prototype.hasOwnProperty.call(translationMap, key) &&
                Object.prototype.hasOwnProperty.call(localPrivileges, key)
              )
              .map((key) => (
                <PrivilegeToggle key={key} privilegeKey={key as string} />
              ))}
          </Flex>
        ))}
    </Flex>
  );
};

export default MasterPrivilegesPage;