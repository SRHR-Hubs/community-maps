import qs from 'qs';

export default () => (obj, options) => qs.stringify(obj, {
    ...options,
    encodeValuesOnly: true,
    indices: false,
})