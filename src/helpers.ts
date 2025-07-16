export function classNames(
  defaultClasses: string,
  classMap: Record<string, boolean>
): string {
  /**
   * Example usage:
   * classNames('c-button', {
   *   'is-primary': true,
   *   'is-secondary': false,
   *   'is-small': true
   * }) -> 'c-button is-primary is-small'
  */

  const filteredClasses = Object.entries(classMap).reduce((acc, [key, check]) => {
    return check ? `${acc} ${key}`.trim() : acc
  }, '')

  return `${defaultClasses} ${filteredClasses}`.trim()
}
