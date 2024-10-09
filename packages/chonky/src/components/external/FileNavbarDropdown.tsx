/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Menu from '@mui/material/Menu';
import React, { useCallback, useMemo } from 'react';

import { FileActionGroup } from '../../types/action-menus.types';
import { useLocalizedFileActionGroup } from '../../util/i18n';
import { important, makeGlobalChonkyStyles } from '../../util/styles';
import { ToolbarButton, ToolbarButtonProps } from './ToolbarButton';
import { SmartToolbarDropdownButton } from './ToolbarDropdownButton';

export type FileNavbarDropdownProps = FileActionGroup;

export const FileNavbarDropdown: React.FC<FileNavbarDropdownProps> = React.memo(
    (props) => {
        const { name, icon, fileActionIds } = props;
        const [anchor, setAnchor] = React.useState<null | HTMLElement>(null);

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLButtonElement>) =>
                setAnchor(event.currentTarget),
            [setAnchor]
        );
        const handleClose = useCallback(() => setAnchor(null), [setAnchor]);

        const menuItemComponents = useMemo(
            () =>
                fileActionIds.map((id) => (
                    <SmartToolbarDropdownButton
                        key={`menu-item-${id}`}
                        fileActionId={id}
                        onClickFollowUp={handleClose}
                    />
                )),
            [fileActionIds, handleClose]
        );

        const localizedName = useLocalizedFileActionGroup(name);
        const toolbarButtonProps: ToolbarButtonProps = {
            text: localizedName,
            onClick: handleClick,
            dropdown: true,
        };
        if (icon) {
            toolbarButtonProps.icon = icon;
            toolbarButtonProps.iconOnly = true;
            toolbarButtonProps.text = '';
        }

        const classes = useStyles();
        return (
            <>
                <ToolbarButton {...toolbarButtonProps} />
                <Menu
                    autoFocus
                    keepMounted
                    elevation={2}
                    anchorEl={anchor}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    onClose={handleClose}
                    open={Boolean(anchor)}
                    transitionDuration={150}
                    classes={{ list: classes.dropdownList }}
                    slotProps={{
                        paper: {
                            sx: {
                                boxShadow: 'none',
                                '&.MuiButtonBase-root:hover': {
                                    bgcolor: 'transparent',
                                },
                            },
                        },
                    }}
                >
                    {menuItemComponents}
                </Menu>
            </>
        );
    }
);

const useStyles = makeGlobalChonkyStyles((theme) => ({
    dropdownList: {
        padding: important(0),
        borderRadius: '5px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: theme.colors.borderGray,
    },
}));
