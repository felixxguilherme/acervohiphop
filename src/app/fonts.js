import localFont from 'next/font/local';

export const dirtyStainsFont = localFont({
    src: [
        {
            path: '../../public/fonts/DirtyStains.otf',
            weight: '400',
            style: 'normal',
        }
    ],
    variable: '--font-dirty-stains'
})

export const scratchyFont = localFont({
    src: [
        {
            path: '../../public/fonts/Scratchy.woff',
            weight: '400',
            style: 'normal',
        }
    ],
    variable: '--font-scratchy'
})

export const sometypeMonoFont = localFont({
    src: [
        {
            path: '../../public/fonts/SometypeMono-Italic-VariableFont_wght.ttf',
            weight: '400',
            style: 'italic',
        },
        {
            path: '../../public/fonts/SometypeMono-VariableFont_wght.ttf',
            weight: '400',
            style: 'normal'
        }
    ],
    variable: '--font-sometype-mono-italic'
})