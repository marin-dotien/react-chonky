import React, { CSSProperties, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';

import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewMode } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { SmartFileEntry } from './FileEntry';

export interface ColumnDefinition {
    key: string;
    label: string;
    flex?: string;
    textAlign?: CSSProperties['textAlign'];
}

export interface FileListListProps {
    width: number;
    height: number;
    columns: ColumnDefinition[];
}

export const ListContainer: React.FC<FileListListProps> = React.memo((props) => {
    const { width, height, columns } = props;

    const viewConfig = useSelector(selectFileViewConfig);

    const listRef = useRef<FixedSizeList>();

    const displayFileIds = useSelector(selectors.getDisplayFileIds);
    const displayFileIdsRef = useInstanceVariable(displayFileIds);
    const getItemKey = useCallback(
        (index: number) => displayFileIdsRef.current[index] ?? `loading-file-${index}`,
        [displayFileIdsRef]
    );

    const classes = useStyles();
    const listComponent = useMemo(() => {
        // When entry size is null, we use List view
        const rowRenderer = (data: { index: number; style: CSSProperties }) => {
            return (
                <div style={data.style} className={classes.row}>
                    <SmartFileEntry
                        fileId={displayFileIds[data.index] ?? null}
                        displayIndex={data.index}
                        fileViewMode={FileViewMode.List}
                    />
                </div>
            );
        };

        return (
            <>
                <div className={classes.headerRow} style={{ width }}>
                    {columns.map((column) => (
                        <div
                            key={column.key}
                            className={classes.headerCellProperty}
                            style={{
                                flex: column.flex || '10%',
                                textAlign: column.textAlign || 'left',
                            }}
                        >
                            {column.label}
                        </div>
                    ))}
                </div>
                <FixedSizeList
                    ref={listRef as any}
                    className={classes.listContainer}
                    itemSize={viewConfig.entryHeight}
                    height={height}
                    itemCount={displayFileIds.length}
                    width={width}
                    itemKey={getItemKey}
                >
                    {rowRenderer}
                </FixedSizeList>
            </>
        );
    }, [
        classes.row,
        classes.listContainer,
        viewConfig.entryHeight,
        height,
        displayFileIds,
        width,
        getItemKey,
        columns,
    ]);

    return listComponent;
});

const useStyles = makeLocalChonkyStyles((theme) => ({
    listContainer: {
        borderTop: `solid 1px ${theme.palette.divider}`,
    },
    headerRow: {
        display: 'flex',
        padding: '10px 0',
        fontSize: theme.listFileEntry.headerFontSize,
        backgroundColor: 'transparent',
    },
    headerCellProperty: {
        marginRight: '20px',
        textTransform: 'uppercase',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    },
}));
