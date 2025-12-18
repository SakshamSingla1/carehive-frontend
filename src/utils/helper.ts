import { type ColorTheme } from "../services/useColorThemeService";
import moment from "moment";
import { createSearchParams, generatePath } from "react-router-dom";
import { type MakeRouteParams } from "./types";

export const replaceUrlParams = (
	url: string,
	params: { [key: string]: any }
) => {
	for (const key in params) {
		url = url.replace(`:${key}`, params[key]);
	}
	return url;
};

export const getColor = (theme: ColorTheme | null,colorName: string) => {
    if(!theme?.palette?.colorGroups) return "";
    for( const group of theme.palette.colorGroups){
        for(const shade of group.colorShades){
            if(shade.colorName === colorName) return shade.colorCode;
        }
    }
    return "";
}

export const DateUtils = {
	// 1. "19-04-2025 23:59:59" -> "19-04-2025"
	formatDateTimeToDate(dateTime: string): string {
		return moment(dateTime, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY");
	},

	// 2. 1745173799 -> "19-04-2025"
	unixToDate(unix: number): string {
		return moment.unix(unix).format("DD-MM-YYYY");
	},

	// 3. "19-04-2025" -> 1745173799
	dateToUnix(date: string): number {
		return moment(date, "DD-MM-YYYY").unix();
	},

	// 4. 1745173799 -> "19-04-2025 23:59:59"
	unixToDateTime(unix: number): string {
		return moment.unix(unix).format("DD-MM-YYYY HH:mm:ss");
	},

	// 5. "19-04-2025 23:59:59" -> 1745173799
	dateTimeToUnix(dateTime: string): number | null {
		if (!dateTime) return null;
		return moment(dateTime, "DD-MM-YYYY HH:mm:ss").unix();
	},

	// "2025-02-20 15:27:04.0" -> "19-04-2025"
	dateTimeSecondToDate(dateTime: string): string {
		return moment(dateTime).format("DD-MM-YYYY");
	},

	unixToYYYYMMDD(unix: number): string {
		return moment.unix(unix).format("YYYY-MM-DD");
	},

	// "2025-02-20 15:27:04.0" -> "19-04-2025 15:27"
	dateTimeSecondToDateTime(dateTime: string): string {
		if (!dateTime) return "No Data";
		return moment(dateTime).format("DD-MM-YYYY HH:mm");
	},
};

// In helper.ts
export const makeRoute = <T extends Record<string, string | number> = {}>(
  path: string,
  options?: {
    params?: T;
    query?: Record<string, string | number | boolean | undefined | null>;
  }
): string => {
  // Ensure the path starts with a forward slash
  let processedPath = path.startsWith('/') ? path : `/${path}`;
  const { params = {}, query = {} } = options || {};

  // Replace path parameters
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      processedPath = processedPath.replace(`:${key}`, String(value));
    }
  }

  // Handle query parameters
  const queryParams = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  }

  const queryString = queryParams.toString();
  return queryString ? `${processedPath}?${queryString}` : processedPath;
};

export const userNameMaker = (email: string): string => {
    if (!email) return 'user';
    return email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'user';
}

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const getBreadcrumbsFromUrl = (pathname: string): Array<{ label: string; path: string }> => {
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];
  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath = `${currentPath}/${segment}`;
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    breadcrumbs.push({ label, path: currentPath });
  }
  return breadcrumbs;
};