import { ReactComponent as BonusIcon } from '../../../../assets/icons/payment/bonus.svg'
import { ReactComponent as BalanceIcon } from '../../../../assets/icons/payment/balance.svg'
import { ReactComponent as CashIcon } from '../../../../assets/icons/payment/cash.svg'
import { ReactComponent as CardIcon } from '../../../../assets/icons/payment/card.svg'
import { ReactComponent as QRIcon } from '../../../../assets/icons/payment/qr-code.svg'

export const PAY_METHODS = [
	{
		id: 1,
		name: 'Бонусы',
		icon: <BonusIcon />,
		latin: 'BONUS_PAYMENT',
	},
	{
		id: 2,
		name: 'Баланс',
		icon: <BalanceIcon />,
		latin: 'BALANCE_PAYMENT',
	},
	{
		id: 3,
		name: 'Наличные',
		icon: <CashIcon />,
		latin: 'CASH',
	},
	{
		id: 4,
		name: 'Карта',
		icon: <CardIcon />,
		latin: 'CARD',
	},
	{
		id: 5,
		name: 'QR-код',
		icon: <QRIcon />,
		latin: 'QR_CODE',
	},
]

export const checkCanShow = (method: any, bonus: number, balance: number) => {
    switch (method.latin) {
        case 'BONUS_PAYMENT':
            return bonus > 0
        case 'BALANCE_PAYMENT':
            return balance > 0
        default:
            return true
    }
}