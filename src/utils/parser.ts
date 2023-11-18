import { type AxiosResponse } from 'axios'

export interface Post {
    fidLink?: string
    id?: string
    title?: string
    description?: string
    link?: string
}

export interface Feed {
    link?: string
    title?: string
    description?: string
}

export const parser = (contents: string): [Feed, Post[]] => {
    const domParser = new DOMParser()



    const xmlData = domParser.parseFromString(contents, 'application/xml')

    const errorNode = xmlData.querySelector('parsererror');

    if (errorNode !== null) {
        throw new Error('networkErrors.invalidRss');
    }

    const fidLink = xmlData.querySelector('link')?.textContent?.trim()

    const fid = {
        link: fidLink,
        title: xmlData.querySelector('title')?.textContent?.trim(),
        description: xmlData.querySelector('description')?.textContent?.trim(),
    }

    const posts: Post[] = []
    const itemPosts = xmlData.querySelectorAll('item')
    itemPosts.forEach((postElement) => {
        const post = {
            fidLink,
            id: postElement.querySelector('guid')?.textContent?.trim(),
            title: postElement.querySelector('title')?.textContent?.trim(),
            description: postElement.querySelector('description')?.textContent?.trim(),
            link: postElement.querySelector('link')?.textContent?.trim(),
        }

        posts.push(post)
    })
    return [fid, posts]
}
