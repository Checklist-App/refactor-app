export default interface IDataBaseService {
  set: (key: string, value: string | number | boolean) => void
  getString: (key: string) => string | undefined
  getBoolean: (key: string) => boolean | undefined
  delete: (key: string) => void
}
