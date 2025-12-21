import React, { useEffect, useState } from 'react'
import { HTTP_STATUS, type IPagination, SORT_ENUM } from '../../../utils/types';
import { initialPaginationValues } from '../../../utils/constant';
import NavlinkListTableTemplate from '../../templates/Navlinks/NavlinksListing.template';
import { useNavlinkService , type NavlinkResponse , type NavlinkFilterRequest} from '../../../services/useNavlinkService';
import { useSearchParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackbar';

const NavlinkListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navlinkService = useNavlinkService();
    const { showSnackbar } = useSnackbar();

    const initialFiltersValues: any = {
        search: searchParams.get("search") || "",
    };

    const [filters, setFiltersTo] = useState<any>(initialFiltersValues);
    const [pagination, setPagination] = useState<IPagination>({
        ...initialPaginationValues,
        currentPage: Number(searchParams.get("page")) || 0,
        pageSize: Number(searchParams.get("size")) || 10,
    });
    const [navlinks, setNavlinksTo] = useState<NavlinkResponse[]>([]);

    const refreshNavlinks = async (page: string, size: string) => {
        const params: NavlinkFilterRequest = {
            page: page,
            size: size,
            sort: SORT_ENUM.CREATED_AT_DESC,
            search: filters?.search,
            role: filters?.role
        };
        await navlinkService.getAllNavlinks(params)
            .then((res) => {
                if (res?.status === HTTP_STATUS.OK) {
                    const { totalElements, totalPages } = res?.data?.data;
                    setPagination({
                        ...pagination,
                        totalPages: totalPages,
                        totalRecords: totalElements
                    });
                    setNavlinksTo(res?.data?.data?.content);
                }
            }).catch((error) => {
                setNavlinksTo([]);
                console.log(error);
                showSnackbar('error', 'Failed to fetch navlinks');
            })
    }

    const handleFiltersChange = (name: string, value: any) => {
        setFiltersTo({ ...filters, [name]: value ?? "" });
        setPagination({ ...pagination, currentPage: 0 })
    }

    const handlePaginationChange = (_event: React.MouseEvent<HTMLButtonElement>, newPage: number) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            currentPage: newPage
        }));
    }

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setPagination((prevPagination) => ({
            ...prevPagination,
            pageSize: newRowsPerPage
        }));
    };

    useEffect(() => {
        refreshNavlinks(pagination.currentPage.toString(), pagination.pageSize.toString());
    }, [filters, pagination.currentPage, pagination.pageSize]);

    useEffect(() => {
        const params: Record<string, string> = {
            page: pagination.currentPage.toString(),
            size: pagination.pageSize.toString(),
            search: filters.search ?? "",
        };
        setSearchParams(params);
    }, [filters.search, pagination]);

    return (
        <div>
            <NavlinkListTableTemplate navlinks={navlinks} pagination={pagination} handleFiltersChange={handleFiltersChange} handlePaginationChange={handlePaginationChange} handleRowsPerPageChange={handleRowsPerPageChange} filters={filters} />
        </div>
    )
}

export default NavlinkListPage;
