import React from 'react';

import { FileBrowserHandle, FileBrowserProps } from '../../types/file-browser.types';
import { FileList } from '../file-list/FileList';
import { FileBrowser } from './FileBrowser';
import { FileContextMenu } from './FileContextMenu';
import { FileNavbar } from './FileNavbar';
import { FileToolbar } from './FileToolbar';
import { ColumnDefinition } from '../file-list/ListContainer';

export interface FullFileBrowserProps extends FileBrowserProps {
    columns?: ColumnDefinition[];
}

export const FullFileBrowser = React.memo(
    React.forwardRef<FileBrowserHandle, FullFileBrowserProps>((props, ref) => {
        const { onScroll, columns } = props;

        const defaultColumns: ColumnDefinition[] = [
            { accessor: 'name', label: 'Name', flex: '10%', justifyContent: 'start' },
            { accessor: 'size', label: 'Size', flex: '10%', justifyContent: 'start' },
            {
                accessor: 'modDate',
                label: 'Modified',
                flex: '10%',
                justifyContent: 'start',
            },
        ];

        return (
            <FileBrowser ref={ref} {...props}>
                {props.folderChain?.length ? <FileNavbar /> : undefined}
                <FileToolbar />
                <FileList onScroll={onScroll} columns={columns || defaultColumns} />
                <FileContextMenu />
            </FileBrowser>
        );
    })
);

FullFileBrowser.displayName = 'FullFileBrowser';
