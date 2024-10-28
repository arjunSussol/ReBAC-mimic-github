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

  const resourceInstances = await permit.api.resourceInstances.list()
  console.log(`Found ${resourceInstances.length} resourceInstances`)
  for(const instance of resourceInstances) {
    console.log(`deleting resourceInstances: ${instance.key}`)
    await permit.api.roleAssignments.delete(instance.key)
  }
}

const createResources = async () => {
  console.log('Creating resources, action, roles and permissions')
  await permit.api.createResource(
    {
      'key': 'account',
      'name': 'Account',
      'actions': {
        'create': {},
        'delete': {},
        'edit': {},
        'view': {}
      },
      'roles': {
        'owner': {
          'name': 'Owner',
          'permissions': [
            'create',
            'delete',
            'edit',
            'view'
          ]
        },
        'admin': {
          'name': 'Admin',
          'permissions': [
            'edit',
            'view'
          ]
        },
        'member': {
          'name': 'Member',
          'permissions': [
            'view'
          ]
        }
      }
    }
  )

  await permit.api.createResource(
    {
      'key': 'repository',
      'name': 'Repository',
      'actions': {
        'create': {},
        'delete': {},
        'edit': {},
        'view': {}
      },
      'roles': {
        'owner': {
          'name': 'Owner',
          'permissions': [
            'create',
            'view',
            'delete',
            'edit'
          ],
        },
        'admin': {
          'name': 'Admin',
          'permissions': [
            'view',
            'edit'
          ],
        },
        'member': {
          'name': 'Member',
          'permissions': [
            'view',
          ],
        },
      },
    }
  )

  await permit.api.createResource(
    {
      'key': 'organization',
      'name': 'Organization',
      'actions': {
        'create': {},
        'delete': {},
        'edit': {},
        'view': {}
      },
      'roles': {
        'admin': {
          'name': 'Admin',
          'permissions': [
            'edit',
            'view'
          ],
        },
        'member': {
          'name': 'Member',
          'permissions': [
            'view',
          ],
        },
      },
    }
  )
}

const createRelations = async () => {
  await permit.api.resourceRelations.create('organization', {
    key: 'parent',
    name: 'Parent',
    subject_resource: 'repository',
  })

  await permit.api.resourceRelations.create('repository', {
    key: 'account',
    name: 'Account',
    subject_resource: 'account',
  })

  await permit.api.resourceRelations.create('organization', {
    key: 'account',
    name: 'Account',
    subject_resource: 'account',
  })
}

const createUser = async () => {
  await permit.api.syncUser({
    key: 'sahil@coding.com',
  })

  await permit.api.syncUser({
    key: 'anesh@coding.com',
  })

  await permit.api.syncUser({
    key: 'arjun@gmail.com',
  })
}

const createResourceInstance = async () => {
  await permit.api.resourceInstances.create({
    resource: 'repository',
    key: 'ReBAC_github',
    tenant: 'default',
  })

  await permit.api.resourceInstances.create({
    resource: 'organization',
    key: 'coding_mountain',
    tenant: 'default',
  })

  await permit.api.resourceInstances.create({
    resource: 'account',
    key: 'coding',
    tenant: 'default',
  })
}

const assignRole = async () => {
  await permit.api.roleAssignments.assign({
    user: 'sahil@coding.com',
    role: 'admin',
    resource_instance: 'organization:coding_mountain',
  })

  await permit.api.roleAssignments.assign({
    user: 'anesh@coding.com',
    role: 'owner',
    resource_instance: 'repository:ReBAC_github',
  })

  await permit.api.roleAssignments.assign({
    user: 'arjun@gmail.com',
    role: 'member',
    resource_instance: 'repository:ReBAC_github',
  })
}

const createRoleDerivation = async () => {
  await permit.api.resourceRoles.update('organization', 'member', {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: 'parent',
          on_resource: 'repository',
          role: 'member',
        },
      ]
    }
  })

  await permit.api.resourceRoles.update('organization', 'admin', {
    granted_to: {
      users_with_role: [
        {
          linked_by_relation: 'parent',
          on_resource: 'repository',
          role: 'admin',
        }
      ]
    }
  })
}

(async () => {
  await cleanEnv()
  await createResources()
  console.log('createResources')

  await createRelations()
  console.log('createRelations')

  await createUser()
  console.log('createUser')

  await createResourceInstance()
  console.log('createResourceInstance')

  await assignRole()
  console.log('assignRole')

  await createRoleDerivation()
  console.log('createRoleDerivation')
})()