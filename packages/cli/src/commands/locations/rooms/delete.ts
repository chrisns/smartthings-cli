import { Flags } from '@oclif/core'
import { APICommand } from '@smartthings/cli-lib'
import { chooseRoom } from '../../../lib/commands/locations/rooms-util'


export default class RoomsDeleteCommand extends APICommand<typeof RoomsDeleteCommand.flags> {
	static description = 'delete a room'

	static flags = {
		...APICommand.flags,
		location: Flags.string({
			char: 'l',
			description: 'a specific location to query',
			helpValue: '<UUID>',
		}),
	}

	static args = [{
		name: 'id',
		description: 'room UUID',
	}]

	static aliases = ['rooms:delete']

	async run(): Promise<void> {
		const [roomId, locationId] = await chooseRoom(this, this.flags.location, this.args.id)
		await this.client.rooms.delete(roomId, locationId)
		this.log(`room ${roomId} deleted`)
	}
}
