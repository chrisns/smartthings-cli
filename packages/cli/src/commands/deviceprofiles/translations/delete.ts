import { LocaleReference } from '@smartthings/core-sdk'

import { APIOrganizationCommand, selectFromList, SelectFromListConfig } from '@smartthings/cli-lib'

import { chooseDeviceProfile } from '../../../lib/commands/deviceprofiles-util'


export default class DeviceProfileTranslationsDeleteCommand extends APIOrganizationCommand<typeof DeviceProfileTranslationsDeleteCommand.flags> {
	static description = 'delete a device profile translation'

	static flags = APIOrganizationCommand.flags

	static args = [
		{
			name: 'id',
			description: 'device profile UUID or number in the list',
		},
		{
			name: 'tag',
			description: 'the locale tag',
		},
	]

	static examples = [
		'$ smartthings deviceprofiles:translations:delete 3acbf2fc-6be2-4be0-aeb5-44759cbd66c2 en',
		'Device profile "3acbf2fc-6be2-4be0-aeb5-44759cbd66c2" translation "en" deleted',
		'',
		'$ smartthings deviceprofiles:translations:delete',
		'┌────┬─────────────────────┬─────────────┬──────────────────────────────────────┐',
		'│ #  │ Name                │ Status      │ Id                                   │',
		'├────┼─────────────────────┼─────────────┼──────────────────────────────────────┤',
		'│  1 │ Test Switch         │ DEVELOPMENT │ 58e73d0c-b5a5-4814-b344-c10f4ff357bb │',
		'│  2 │ Two Channel Outlet  │ DEVELOPMENT │ 3acbf2fc-6be2-4be0-aeb5-44759cbd66c2 │',
		'└────┴─────────────────────┴─────────────┴──────────────────────────────────────┘',
		'? Enter id or index 2',
		'┌───┬─────┐',
		'│ # │ Tag │',
		'├───┼─────┤',
		'│ 1 │ en  │',
		'│ 2 │ es  │',
		'└───┴─────┘',
		'? Enter id or index 1',
		'Device profile "3acbf2fc-6be2-4be0-aeb5-44759cbd66c2" translation "en" deleted',
	]

	static aliases = ['device-profiles:translations:delete']

	async run(): Promise<void> {
		const deviceProfileId = await chooseDeviceProfile(this, this.args.id)

		const localeTagSelectConfig: SelectFromListConfig<LocaleReference> = {
			primaryKeyName: 'tag',
			sortKeyName: 'tag',
			listTableFieldDefinitions: ['tag'],
		}
		const localeTag = await selectFromList(this, localeTagSelectConfig, {
			preselectedId: this.args.tag,
			listItems: () => this.client.deviceProfiles.listLocales(deviceProfileId),
			promptMessage: 'Select a locale:',
		})

		await this.client.deviceProfiles.deleteTranslations(deviceProfileId, localeTag)
		this.log(`Translation ${localeTag} deleted from device profile ${deviceProfileId}.`)
	}
}
