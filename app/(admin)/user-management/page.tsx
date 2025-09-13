import { prisma } from "@/prisma/client"
import { Button, Link, Table, Text } from "@radix-ui/themes"

const AdminPanel = async () => {
  const users = await prisma.user.findMany()
  const invitations = await prisma.invitation.findMany()

  return (
    <section className="m-5">
      <h2 className="flex justify-center p-4">
        <Text size="5">User Management</Text>
      </h2>

      <div className="mb-5">
        <Button>
          <Link href="/invite-user" className="text-slate-50">
            Invite User
          </Link>
        </Button>
      </div>
      <section className="m-5">
        <h2>
          <Text size="5">Pending Invitations</Text>
        </h2>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {invitations.map((invitation: any) => (
              <Table.Row key={invitation.id}>
                <Table.Cell>{invitation.email}</Table.Cell>
                <Table.Cell>{invitation.role}</Table.Cell>
                <Table.Cell>{invitation.createdAt.toISOString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </section>
      <section className="m-5">
        <h2>
          <Text size="5">Current Users</Text>
        </h2>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {users.map((user: any) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.name}</Table.Cell>
                <Table.Cell>role here</Table.Cell>
                <Table.Cell>{user.createdAt.toISOString()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </section>
    </section>
  )
}

export default AdminPanel
