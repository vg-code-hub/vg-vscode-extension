export const getOssUrl = (v: string, h: number = 64) => {
  return `${v}?x-oss-process=image/resize,h_${h},m_lfit`;
};
