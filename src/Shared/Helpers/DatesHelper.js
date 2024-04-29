export const FORMAT_DMY = 'DMY';

export const FORMAT_YMD = 'YMD';

/**
 *
 * @param {Object} param0
 * @param {String} param0.date
 * @param {String} param0.inputFormat
 * @param {String} param0.outputFormat
 * @returns {String} the passed date formatted into outputFormat
 */
export function switchDateFormat({ date, inputFormat, outputFormat }) {
  if (!inputFormat || !outputFormat) {
    throw new Error('Not a valid format: ', date);
  }

  const separatorChar = inputFormat === FORMAT_DMY ? '/' : '-';

  const joinnerChar = outputFormat === FORMAT_DMY ? '/' : '-';

  return date.split(separatorChar)
    .reverse()
    .join(joinnerChar);
}
