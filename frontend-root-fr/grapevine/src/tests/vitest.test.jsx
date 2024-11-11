import { expect, test} from 'vitest'
import { sum } from './sum.jsx'

test('add 1 + 2 to equal 3', () =>{
    expect(sum(1,5)).toBe(6)
})