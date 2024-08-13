/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */

import React, { CSSProperties, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FixedSizeList } from 'react-window';

import { selectFileViewConfig, selectors } from '../../redux/selectors';
import { FileViewMode } from '../../types/file-view.types';
import { useInstanceVariable } from '../../util/hooks-helpers';
import { makeLocalChonkyStyles } from '../../util/styles';
import { SmartFileEntry } from './FileEntry';

export interface FileListListProps {
    width: number;
    height: number;
}

export const ListContainer: React.FC<FileListListProps> = React.memo((props) => {
    const { width, height } = props;

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
                    <div className={classes.headerCellName}>Naziv</div>
                    <div className={classes.headerCellProperty}>Folder</div>
                    <div className={classes.headerCellProperty}>Uređivano</div>
                    <div className={classes.headerCellProperty}>Autor</div>
                    <div className={classes.headerCellProperty}>Rok</div>
                    <div className={classes.headerCellProperty}>Status</div>
                    <div className={classes.headerCellOptions}></div>
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
    ]);

    return listComponent;
});

const useStyles = makeLocalChonkyStyles((theme) => ({
    listContainer: {
        borderTop: `solid 1px ${theme.palette.divider}`,
    },
    headerRow: {
        display: 'flex',
        gap: '20px',
        padding: '10px 0',
        fontSize: theme.listFileEntry.headerFontSize,
        backgroundColor: 'transparent',
    },
    headerCellName: {
        flex: '0 1 20%', // Matches the name cell size in ListEntry
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    headerCellProperty: {
        flex: '0 1 15%', // Matches the property cells in ListEntry
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    headerCellOptions: {
        flex: '0 1 5%',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    },
}));
