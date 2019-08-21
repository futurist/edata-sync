
type Message = {
    source: string[],
    path: string[] | string,
    type: 'set' | 'unset',
    data: any
}

type SyncOptions = {
    data?: any,
    name: string,
    postMessage: (msg: Message) => any,
    onMessage?: (msg: Message) => any,
}

function plugin(options: SyncOptions) {
    const { name, postMessage, onMessage } = options
    if (!name) {
        throw 'options.name cannot be empty'
    }
    return (root: any) => {
        const { observer } = root
        if (!observer) {
            return
        }
        observer.map((e: any) => {
            let { path, type, data, meta } = e
            if (type === 'delete') {
                type = 'unset'
            } else {
                type = 'set'
            }
            root.postMessage({
                source: (meta || {}).source,
                path,
                type,
                data: data.unwrap()
            })
        })
        root.postMessage = (msg: Message) => {
            const source = (msg.source || []).concat(name)
            postMessage({ ...msg, source })
        }
        root.onMessage = (msg: Message) => {
            onMessage && onMessage(msg)
            const { source = [], path, type, data } = msg
            if (source.indexOf(name) > -1) {
                // discard self message
                return
            }
            switch (type) {
                case 'set': {
                    const {meta} = root.observer
                    root.observer.meta = {
                        source
                    }
                    root.set(path, data)
                    root.observer.meta = meta
                    break
                }
                case 'unset': {
                    root.unset(path)
                    break
                }
            }
        }
    }
}

export default plugin
