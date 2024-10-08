/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import React, { ReactElement, useMemo } from 'react';

// import { ChonkyActions } from '../../action-definitions/index';
import { important, makeGlobalChonkyStyles } from '../../util/styles';
import { useFolderChainItems } from './FileNavbar-hooks';
import { FolderChainButton } from './FolderChainButton';
import { SmartToolbarButton } from './ToolbarButton';
import { useSelector } from 'react-redux';
import { selectNavbarItems } from '../../redux/selectors';
import { FileNavbarDropdown } from './FileNavbarDropdown';
import { useIntl } from 'react-intl';

export interface FileNavbarProps {}

export const FileNavbar: React.FC<FileNavbarProps> = React.memo(() => {
    const classes = useStyles();
    const intl = useIntl();
    const folderChainItems = useFolderChainItems();

    const navbarItems = useSelector(selectNavbarItems);

    const navbarItemComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < navbarItems.length; ++i) {
            const item = navbarItems[i];

            const key = `navbar-item-${typeof item === 'string' ? item : item.name}`;
            const component =
                typeof item === 'string' ? (
                    <SmartToolbarButton key={key} fileActionId={item} />
                ) : (
                    <FileNavbarDropdown key={key} {...item} />
                );
            components.push(component);
        }
        return components;
    }, [navbarItems]);

    const folderChainComponents = useMemo(() => {
        const components: ReactElement[] = [];
        for (let i = 0; i < folderChainItems.length; ++i) {
            const key = `folder-chain-${i}`;
            const component = (
                <FolderChainButton
                    key={key}
                    current={i === folderChainItems.length - 1}
                    item={folderChainItems[i]}
                />
            );
            components.push(component);
        }
        return components;
    }, [folderChainItems]);

    return (
        <Box className={classes.navbarWrapper}>
            <Box className={classes.navbarContainer}>
                {/* <SmartToolbarButton fileActionId={ChonkyActions.OpenParentFolder.id} /> */}
                {folderChainItems.length === 1 && (
                    <span className={classes.breadcrumbsIntroText}>
                        {intl.formatMessage({
                            id: 'chonky.breadcrumbs.intro_text',
                            defaultMessage: 'Welcome to Lexi',
                        })}
                    </span>
                )}
                <Breadcrumbs
                    className={classes.navbarBreadcrumbs}
                    classes={{ separator: classes.separator }}
                >
                    {folderChainComponents}
                </Breadcrumbs>

                <div>{navbarItemComponents}</div>
            </Box>
        </Box>
    );
});

const useStyles = makeGlobalChonkyStyles((theme) => ({
    navbarWrapper: {
        paddingBottom: theme.margins.rootLayoutMargin,
    },

    navbarContainer: {
        display: 'flex',
        alignItems: 'center',
        color: important(theme.colors.black),
        fontWeight: important(700),
    },

    upDirectoryButton: {
        fontSize: important(theme.toolbar.fontSize),
        height: theme.toolbar.size,
        width: theme.toolbar.size,
        padding: important(0),
    },

    navbarBreadcrumbs: {
        fontSize: important(theme.toolbar.fontSize),
        flexGrow: 100,
        fontWeight: important(700),
    },

    separator: {
        marginRight: important(4),
        marginLeft: important(4),
    },

    breadcrumbsIntroText: {
        marginRight: 4,
    },
}));
