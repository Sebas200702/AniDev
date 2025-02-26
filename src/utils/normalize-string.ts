export const normalizeString = (str: string) => {
  return str.replace(/[/?¡.:,;¿!@#$%^&*()\-_=+[\]{}|\\'<>`~"]/g, '').replace(/\s/g, '-')



}
