import { RESTDataSource } from 'apollo-datasource-rest';

export default class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v3/';
  }

  getAllLaunches = async () => {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map((launch) => this.#launchReducer(launch))
      : [];
  }

  getLaunchById = async ({ launchId }) => {
    const response = await this.get(`launches/${launchId}`);
    return this.#launchReducer(response);
  }

  getLaunchesByIds = ({ launchIds }) => {
    return Promise.all(
      launchIds.map((launchId) => this.getLaunchById({ launchId }))
    );
  }

  #launchReducer = (launch) => ({
    id: launch.flight_number || 0,
    cursor: `${launch.launch_date_unix}`,
    site: launch.launch_site && launch.launch_site.site_name,
    mission: {
      name: launch.mission_name,
      missionPatchSmall: launch.links.mission_patch_small,
      missionPatchLarge: launch.links.mission_patch,
    },
    rocket: {
      id: launch.rocket.rocket_id,
      name: launch.rocket.rocket_name,
      type: launch.rocket.rocket_type,
    },
  })
}