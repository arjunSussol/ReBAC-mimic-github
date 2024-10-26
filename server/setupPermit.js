const { Permit } = require('permitio')
const config = require('./utils/config')

const permit = new Permit({
  token: config.PERMIT_API_KEY,
  pdp: config.PDP
})

const cleanEnv = async () => {
  const resources = await permit.api.resources.list()
  console.log(`Found ${resources.length} resources`)
  for (const resource of resources) {
    const resourceRelations = await permit.api.resourceRelations.list({
      resourceKey: resource.key,
    })
    console.log(`Found ${resourceRelations.length} resource relations`)
    for (const resourceRelation of resourceRelations.data) {
      console.log(`Deleting resource relation: ${resourceRelation.key}`)
      await permit.api.resourceRelations.delete(
        resource.key,
        resourceRelation.key,
      )
    }

    const resourceRoles = await permit.api.resourceRoles.list({
      resourceKey: resource.key,
    })
    console.log(`Found ${resourceRoles.length} resource roles`)
    for (const resourceRole of resourceRoles) {
      console.log(`Deleting resource role: ${resourceRole.key}`)
      await permit.api.resourceRoles.delete(
        resource.key,
        resourceRole.key,
      )
    }
    console.log(`Deleting resource: ${resource.key}`)
    await permit.api.resources.delete(resource.key)
  }

  const users = await permit.api.users.list()
  console.log(`Found ${users.length} users`)
  for (const user of users.data) {
    console.log(`Deleting user: ${user.key}`)
    await permit.api.users.delete(user.key)
  }

  const roles = await permit.api.roles.list()
  console.log(`Found ${roles.length} roles`)
  for (const role of roles) {
    console.log(`Deleting role: ${role.key}`)
    await permit.api.roles.delete(role.key)
  }
}

const createResources = async () => {
  await permit.api.createResource(
    {
      'key': 'account',
      'name': 'Account',
      'actions': {
        'invite-member': {},
        'list-members': {},
        'remove-member': {}
      },
      'roles': {
        'admin': {
          'name': 'Admin',
          'permissions': [
            'invite-member',
            'list-members',
            'remove-member'
          ]
        },
        'member': {
          'name': 'Member',
          'permissions': [
            'list-members'
          ]
        }
      }
    }
  )

  await permit.api.createResource(
    {
      'key': 'folder',
      'name': 'Folder',
      'actions': {
        'list-files': {},
        'create-file': {},
        'rename': {},
      },
      'roles': {
        'editor': {
          'name': 'Editor',
          'permissions': [
            'list-files',
            'create-file',
            'rename',
          ],
        },
        'commenter': {
          'name': 'Commenter',
          'permissions': [
            'list-files',
          ],
        },
        'viewer': {
          'name': 'Viewer',
          'permissions': [
            'list-files',
          ],
        },
      },
    }
  )

  await permit.api.createResource(
    {
      'key': 'file',
      'name': 'File',
      'actions': {
        'read': {},
        'comment': {},
        'update': {},
        'delete': {},
      },
      'roles': {
        'editor': {
          'name': 'Editor',
          'permissions': [
            'read',
            'comment',
            'update',
            'delete',
          ],
        },
        'commenter': {
          'name': 'Commenter',
          'permissions': [
            'read',
            'comment',
          ],
        },
        'viewer': {
          'name': 'Viewer',
          'permissions': [
            'read',
          ],
        },
      },
    }
  )
}

const createRelations = async () => {
  await permit.api.resourceRelations.create('file', {
    key: 'parent',
    name: 'Parent',
    subject_resource: 'folder',
  })

  await permit.api.resourceRelations.create('folder', {
    key: 'parent',
    name: 'Parent',
    subject_resource: 'folder',
  })

  await permit.api.resourceRelations.create('folder', {
    key: 'account',
    name: 'Account',
    subject_resource: 'account',
  })

  await permit.api.resourceRelations.create('file', {
    key: 'account',
    name: 'Account',
    subject_resource: 'account',
  })

  await permit.api.resourceRelations.create('file', {
    key: 'account_global',
    name: 'Account Global',
    subject_resource: 'account',
  })
}

const createUser = async () => {
  await permit.api.syncUser({
    key: 'john@acme.com',
  })

  await permit.api.syncUser({
    key: 'jane@acme.com',
  })
}

const createResourceInstance = async () => {
  await permit.api.resourceInstances.create({
    resource: 'file',
    key: '2023_report',
    tenant: 'default',
  })

  await permit.api.resourceInstances.create({
    resource: 'folder',
    key: 'finance',
    tenant: 'default',
  })

  await permit.api.resourceInstances.create({
    resource: 'account',
    key: 'acme',
    tenant: 'default',
  })
}

const assignRole = async () => {
  await permit.api.roleAssignments.assign({
    user: 'john@acme.com',
    role: 'viewer',
    resource_instance: 'file:2023_report',
  })

  await permit.api.roleAssignments.assign({
    user: 'jane@acme.com',
    role: 'editor',
    resource_instance: 'folder:finance',
  })

  await permit.api.roleAssignments.assign({
    user: 'john@acme.com',
    role: 'viewer',
    resource_instance: 'file:2023_report',
    tenant: 'default',
  })
}

const createRelationTuples = async () => {
  await permit.api.relationshipTuples.create({
    subject: 'folder:finance',
    relation: 'parent',
    object: 'file:2023_report',
  })

  await permit.api.relationshipTuples.create({
    subject: 'account:acme',
    relation: 'account',
    object: 'folder:finance',
  })

  await permit.api.relationshipTuples.create({
    subject: 'account:acme',
    relation: 'account',
    object: 'file:2023_report',
  })
}

const createRoleDerivation = async () => {
  await permit.api.resourceRoles.update('file', 'editor', {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: 'parent',
          on_resource: 'folder',
          role: 'editor',
        },
        {
          linked_by_relation: 'account',
          on_resource: 'account',
          role: 'admin',
        },
        {
          linked_by_relation: 'account_global',
          on_resource: 'account',
          role: 'member',
        }
      ]
    }
  })

  await permit.api.resourceRoles.update('file', 'commenter', {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: 'parent',
          on_resource: 'folder',
          role: 'commenter',
        }
      ]
    }
  })

  await permit.api.resourceRoles.update('file', 'viewer', {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: 'parent',
          on_resource: 'folder',
          role: 'viewer',
        }
      ]
    }
  })

  await permit.api.resourceRoles.update('folder', 'editor', {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: 'account',
          on_resource: 'account',
          role: 'admin',
        },
        {
          linked_by_relation: 'parent',
          on_resource: 'folder',
          role: 'editor',
        }
      ]
    }
  })
}

(async () => {
  await cleanEnv()
  await createResources()
  await createRelations()
  await createUser()
  await createResourceInstance()
  await assignRole()
  await createRelationTuples()
  await createRoleDerivation()
  console.log('Done')
})()