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
import { ColumnDefinition } from './ListContainer';

interface StyleState {
    entryState: FileEntryState;
    dndState: DndEntryState;
}

export const ListEntry: React.FC<FileEntryProps & { columns: ColumnDefinition[] }> =
    React.memo(({ file, selected, focused, dndState, columns }) => {
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

        return (
            <div className={classes.listFileEntry} {...fileEntryHtmlProps}>
                <div className={commonClasses.focusIndicator}></div>
                <div
                    className={c([
                        commonClasses.selectionIndicator,
                        classes.listFileEntrySelection,
                    ])}
                ></div>

                {columns.map((column, index) => (
                    <div
                        key={index}
                        className={classes.listFileEntryProperty}
                        style={{
                            flex: column.flex || '10%',
                            justifyContent: column.textAlign || 'left',
                        }}
                    >
                        {column.accessor === 'name' ? (
                            <div className={classes.listFileEntryIcon}>
                                <ChonkyIcon
                                    icon={dndIconName ?? entryState.icon}
                                    spin={dndIconName ? false : entryState.iconSpin}
                                    fixedWidth={true}
                                />
                            </div>
                        ) : null}
                        {file?.[column.accessor] !== undefined ? (
                            column.accessor === 'name' ? (
                                <FileEntryName file={file} />
                            ) : (
                                file[column.accessor]
                            )
                        ) : (
                            <TextPlaceholder minLength={5} maxLength={15} />
                        )}
                    </div>
                ))}

                <div className={classes.listFileEntryOptions}>
                    <button>...</button>
                </div>
            </div>
        );
    });

const useStyles = makeLocalChonkyStyles((theme) => ({
    listFileEntry: {
        position: 'relative',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        padding: '4px 0',
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
    listFileEntryProperty: {
        zIndex: 20,
        overflow: 'hidden',
        display: 'flex',
        marginRight: '20px',
        fontSize: theme.listFileEntry.propertyFontSize,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
    },
    listFileEntryOptions: {
        flex: '1 1 5%',
        textAlign: 'center',
    },
}));
