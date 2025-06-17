import styled from 'styled-components';
import {Breadcrumb} from 'antd';

export const StyledBreadCrumb = styled(Breadcrumb)<{colorbgcontainer: string}>`
    background-color: ${(props) => props.colorbgcontainer};
    font-family: 'Involve', sans-serif;
`;