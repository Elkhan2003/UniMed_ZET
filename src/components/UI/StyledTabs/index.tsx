import { Tabs } from "antd";
import styled from "styled-components";

interface StyledTabsProps {
	color?: "--myviolet" | "--myadmin"; // Опциональный пропс для выбора цвета
}

export const StyledTabs = styled(Tabs)<StyledTabsProps>`
	--tab-color: ${(props) => `var(${props.color || "--myviolet"})`};

	/* Tab navigation color */
	.ant-tabs-nav {
		color: var(--tab-color);
	}

	/* Active tab indicator */
	.ant-tabs-ink-bar {
		background-color: var(--tab-color) !important;
	}

	/* Tab text color */
	.ant-tabs-tab {
		color: var(--tab-color);
	}

	/* Active tab text color */
	.ant-tabs-tab-active {
		color: var(--tab-color);
	}

	/* Hover state for tabs */
	.ant-tabs-tab:hover {
		color: var(--tab-color);
	}

	/* Active tab border and text color */
	.ant-tabs-tab-active .ant-tabs-tab-btn {
		color: var(--tab-color) !important;
	}

	&.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab {
		border: 1px solid var(--tab-color);
	}

	&.ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active {
		border-color: var(--tab-color);
	}
`;
