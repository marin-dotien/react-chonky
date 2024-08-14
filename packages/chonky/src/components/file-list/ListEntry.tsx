import React, { useContext, useMemo } from 'react';
import { DndEntryState, FileEntryProps } from '../../types/file-list.types';
import { useLocalizedFileEntryStrings } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { TextPlaceholder } from '../external/TextPlaceholder';
import {
    useDndIcon,
    useFileEntryHtmlProps,
    useFileEntryState,
} from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, useCommonEntryStyles } from './GridEntryPreview';

interface StyleState {
    entryState: FileEntryState;
    dndState: DndEntryState;
}

export const ListEntry: React.FC<FileEntryProps> = React.memo(
    ({ file, selected, focused, dndState }) => {
        const entryState: FileEntryState = useFileEntryState(file, selected, focused);
        const dndIconName = useDndIcon(dndState);

        const { fileModDateString } = useLocalizedFileEntryStrings(file);
        const styleState = useMemo<StyleState>(
            () => ({
                entryState,
                dndState,
            }),
            [dndState, entryState]
        );
        const classes = useStyles(styleState);
        const commonClasses = useCommonEntryStyles(entryState);
        const ChonkyIcon = useContext(ChonkyIconContext);
        const fileEntryHtmlProps = useFileEntryHtmlProps(file);

        const isFolder = file?.isDir;

        return (
            <div className={classes.listFileEntry} {...fileEntryHtmlProps}>
                <div className={commonClasses.focusIndicator}></div>
                <div
                    className={c([
                        commonClasses.selectionIndicator,
                        classes.listFileEntrySelection,
                    ])}
                ></div>

                <div className={classes.listFileName}>
                    <div className={classes.listFileEntryIcon}>
                        <ChonkyIcon
                            icon={dndIconName ?? entryState.icon}
                            spin={dndIconName ? false : entryState.iconSpin}
                            fixedWidth={true}
                        />
                    </div>
                    <div
                        className={classes.listFileEntryName}
                        title={file ? file.name : undefined}
                    >
                        <FileEntryName file={file} />
                    </div>
                </div>

                <div className={classes.listFileEntryProperty}>
                    {file ? (
                        file.parentId ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={10} maxLength={20} />
                    )}
                </div>

                <div className={classes.listFileEntryProperty}>
                    {file ? (
                        fileModDateString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={5} maxLength={15} />
                    )}
                </div>

                <div className={classes.listFileEntryProperty}>
                    {file ? (
                        file?.author ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={5} maxLength={15} />
                    )}
                </div>

                <div className={classes.listFileEntryProperty}>
                    {!isFolder ? (
                        file?.deadline ?? <span>—</span>
                    ) : (
                        <span className={classes.invisibleSpan}>-</span>
                    )}
                </div>

                <div
                    className={classes.listFileEntryProperty}
                    style={{ justifyContent: 'flex-end' }}
                >
                    {!isFolder ? (
                        file?.status ?? <span>—</span>
                    ) : (
                        <span className={classes.invisibleSpan}>-</span>
                    )}
                </div>

                <div className={classes.listFileEntryOption}>
                    <button>...</button>
                </div>
            </div>
        );
    }
);

const useStyles = makeLocalChonkyStyles((theme) => ({
    listFileEntry: {
        position: 'relative',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        padding: 4,
        boxShadow: `inset ${theme.palette.divider} 0 -1px 0`,
        fontSize: theme.listFileEntry.fontSize,
        color: ({ dndState }: StyleState) =>
            dndState.dndIsOver
                ? dndState.dndCanDrop
                    ? theme.dnd.canDropColor
                    : theme.dnd.cannotDropColor
                : 'inherit',
    },
    listFileEntrySelection: {
        opacity: 0.6,
    },
    listFileName: {
        zIndex: 20,
        display: 'flex',
        flex: '0 1 20%',
        marginRight: '20px',
    },
    listFileEntryIcon: {
        color: ({ entryState, dndState }: StyleState) =>
            dndState.dndIsOver
                ? dndState.dndCanDrop
                    ? theme.dnd.canDropColor
                    : theme.dnd.cannotDropColor
                : entryState.color,
        fontSize: theme.listFileEntry.iconFontSize,
        boxSizing: 'border-box',
    },
    listFileEntryName: {
        overflow: 'hidden',
        paddingLeft: 8,
        textOverflow: 'ellipsis',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
    },
    listFileEntryProperty: {
        zIndex: 20,
        overflow: 'hidden',
        display: 'flex',
        flex: '0 1 15%',
        marginRight: '20px',
        fontSize: theme.listFileEntry.propertyFontSize,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
    },
    listFileEntryOption: {
        flex: '0 1 5%',
        textAlign: 'center',
    },
    invisibleSpan: {
        visibility: 'hidden',
        display: 'inline-block',
        width: '100%',
    },
    // ..
}));
