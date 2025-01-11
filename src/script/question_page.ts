const timerEventEmitter = async (
    stepPause: number,
    steps: number,
    callback: any,
    onEnd?: any
) => {
    callback(steps - 1)
    // console.log(steps)
    if (steps > 0) {
        setTimeout(async () => {
            await timerEventEmitter(
                stepPause,
                steps - 1,
                (st: any) => {
                    callback(st)
                },
                () => {
                    onEnd()
                }
            )
        }, stepPause)
    } else {
        onEnd()
    }
}

const readText = (char: number, originalText: string, callback: any) => {
    const cutSymbol = originalText.length - char
    const procSymbol = (char * 100) / originalText.length
    const readedText = originalText.slice(0, cutSymbol)
    const awaitedText = originalText.slice(cutSymbol)

    callback(procSymbol)
    return `<span class="highlighted">${readedText}</span>${awaitedText}`
}

export { timerEventEmitter, readText }
