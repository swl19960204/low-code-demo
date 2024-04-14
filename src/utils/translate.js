import { divide, multiply } from 'mathjs'

export function changeStyleWithScale(value, scale) {
    return multiply(value, divide(parseInt(scale), 100))
}