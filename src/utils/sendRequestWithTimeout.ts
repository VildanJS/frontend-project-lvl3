import axios from 'axios'
import { type State } from '@/types'
import { parser } from '@/utils/parser'
import _ from 'lodash'

export const sendRequestWithTimeout = (url: string, delay: number = 5000, state: State): NodeJS.Timeout => {
  const request = (url: string): Promise<string> => {
    return axios
          .get(url)
          .then((res) => res.data.contents)
          .catch((err) => err.message)
  }

  let timerId = setTimeout(() => {
    request(url)
      .then((contents) => {
        const [, posts] = parser(contents)
        const diffPosts = _.differenceWith(posts, state.posts, _.isEqual);
        if(diffPosts.length > 0) state.posts.unshift(...diffPosts)
        clearInterval(timerId)
        timerId = sendRequestWithTimeout(url, delay, state)
      })
      .catch((err) => err.message)
  }, delay)

  return timerId
}

