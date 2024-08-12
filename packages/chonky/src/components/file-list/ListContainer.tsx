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
                <div className={classes.headerRow}>
                    <div className={classes.headerCellIcon}>Icon</div>
                    <div className={classes.headerCellName}>Name</div>
                    <div className={classes.headerCellProperty}>Modified Date</div>
                    <div className={classes.headerCellProperty}>Size</div>
                    <div className={classes.headerCellProperty}>ID</div>
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
        padding: '8px 16px',
        backgroundColor: theme.palette.background.default,
    },
    headerCellIcon: {
        flex: '0 0 50px', // Matches the icon size in the content
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerCellName: {
        flex: '1 1 300px', // Matches the name cell size in the content
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    headerCellProperty: {
        flex: '0 1 150px', // Matches the property cells in the content
        padding: '8px',
        fontWeight: 'bold',
        textAlign: 'left',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
    },
}));
