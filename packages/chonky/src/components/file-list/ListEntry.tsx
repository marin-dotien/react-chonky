import React, { useContext, useMemo } from 'react';
import { DndEntryState, FileEntryProps } from '../../types/file-list.types';
import { ChonkyIconContext } from '../../util/icon-helper';
import { makeLocalChonkyStyles } from '../../util/styles';
import { TextPlaceholder } from '../external/TextPlaceholder';
import {
    useDndIcon,
    useFileEntryHtmlProps,
    useFileEntryState,
} from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, useCommonEntryStyles } from './GridEntryPreview';
import { ColumnDefinition } from './ListContainer';
import { FileHelper } from '../../util/file-helper';

interface StyleState {
    entryState: FileEntryState;
    dndState: DndEntryState;
}

export const ListEntry: React.FC<
    FileEntryProps & { columns: ColumnDefinition[]; displayIndex: number }
> = React.memo(({ file, selected, focused, dndState, columns, displayIndex }) => {
    const entryState: FileEntryState = useFileEntryState(file, selected, focused);
    const dndIconName = useDndIcon(dndState);

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

    const listEntryClass =
        displayIndex === 0
            ? `${classes.listFileEntry} ${classes.firstListFileEntry}`
            : classes.listFileEntry;

    return (
        <div className={listEntryClass} {...fileEntryHtmlProps}>
            <div className={commonClasses.focusIndicator}></div>
            <div className={commonClasses.selectionIndicator}></div>

            {columns.map((column, index) => (
                <div
                    key={index}
                    className={classes.listFileEntryProperty}
                    style={{
                        flex: column.flex || '10%',
                        justifyContent: column.justifyContent || 'left',
                        overflow:
                            column.accessor === 'id' && column.label === 'Hidden'
                                ? 'visible'
                                : 'hidden',
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
                    {column.render ? (
                        column.render(file?.[column.accessor], file)
                    ) : file?.[column.accessor] instanceof Date ? (
                        FileHelper.parseDate(
                            file[column.accessor]
                        )?.toLocaleDateString() || 'N/A'
                    ) : file?.[column.accessor] !== undefined ? (
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
        </div>
    );
});

const useStyles = makeLocalChonkyStyles((theme) => ({
    listFileEntry: {
        position: 'relative',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        gap: 20,
        padding: 4,
        // boxShadow: `inset ${theme.palette.divider} 0 -1px 0`,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.borderGray,
        fontSize: theme.listFileEntry.fontSize,
        color: ({ dndState }: StyleState) =>
            dndState.dndIsOver
                ? dndState.dndCanDrop
                    ? theme.dnd.canDropColor
                    : theme.dnd.cannotDropColor
                : 'inherit',
    },

    firstListFileEntry: {
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: theme.colors.borderGray,
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
        marginRight: '10px',
    },

    listFileEntryProperty: {
        zIndex: 20,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        fontSize: theme.listFileEntry.propertyFontSize,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
    },
}));
