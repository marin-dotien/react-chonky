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
            { key: 'name', label: 'Name', flex: '1', textAlign: 'left' },
            { key: 'size', label: 'Size', flex: '0.5', textAlign: 'right' },
            { key: 'modDate', label: 'Last Modified', flex: '0.5', textAlign: 'right' },
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
