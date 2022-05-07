import { TypeChecker } from './TypeChecker'
import { ABAC } from './ABAC'
import { VM } from './vm'

const abac = new ABAC()

abac.addFunc('get_by_path', (obj: {[key: string]: any}, path: string): any => {
  for (const prop of path.split('.')) {
    obj = obj[prop]
  }

  return obj
}, {
  input: [
    TypeChecker.object,
    TypeChecker.str
  ],
  type: TypeChecker.any
})

const source = "userId = get_by_path(user, 'id')"
const context = abac.Context({
  userId: 1,
  user: {
    id: 1,
    fullName: 'Сюникаев Руслан Харисович'
  },
  query: {
    filter: {
      title: 'ABC%',
      userId: 1
    },
    orders: [{ field: 'title', direction: 'asc' }],
    offset: 0,
    limit: 100
  }
})

VM.ParseAndExecute(source, context)
  .then(console.log)
  .catch(console.error)
