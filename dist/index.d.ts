declare type Message = {
    source: string[];
    path: string[] | string;
    type: 'set' | 'unset';
    data: any;
};
declare type SyncOptions = {
    data?: any;
    name: string;
    postMessage: (msg: Message) => any;
    onMessage?: (msg: Message) => any;
};
declare function plugin(options: SyncOptions): (root: any) => void;
export default plugin;
