import { Arbitrary } from '../check/arbitrary/definition/Arbitrary';
import { GeneratorArbitrary } from './_internals/GeneratorArbitrary';
import { GeneratorValue } from './_internals/builders/GeneratorValueBuilder';

export { GeneratorValue as GeneratorValue };

/**
 * Generate values within the test execution itself by leveraging the strength of `gen`
 *
 * @example
 * ```javascript
 * fc.assert(
 *   fc.property(fc.gen(), gen => {
 *     const size = gen(fc.nat, {max: 10});
 *     const array = [];
 *     for (let index = 0 ; index !== size ; ++index) {
 *       array.push(gen(fc.integer));
 *     }
 *     // Here is an array!
 *     // Note: Prefer fc.array(fc.integer(), {maxLength: 10}) if you want to produce such array
 *   })
 * )
 * ```
 *
 * While `gen` is easy to use, it may not shrink as well as tailored arbitraries based on `filter` or `map`.
 * Additionally it cannot run back the test properly when attempting to replay based on a seed and a path.
 * You'll need to limit yourself to the seed and drop the path from the options if you attempt to replay something
 * implying it.
 * It also does not support custom examples.
 *
 * @remarks Since 3.8.0
 * @public
 */
export function gen(): Arbitrary<GeneratorValue> {
  return new GeneratorArbitrary();
}
