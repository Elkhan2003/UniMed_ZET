import { Layout } from "antd";
import styled from "styled-components";

export const LayoutContent = styled(Layout)`
    background-color: white;
    padding: 20px;
    flex: none;
    height: calc(100vh - 45px); // 100vhтен 45px кем болот

    @media (max-width: 1300px) {
        margin: 12px 12px 0 12px;
    }
`;
