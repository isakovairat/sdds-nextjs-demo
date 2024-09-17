import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next/types';


export const gssp = async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{lol: number}>> => {
    return {
        props: {
            lol: 123
        }
    }
};
