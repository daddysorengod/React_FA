import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  Redirect,
} from "next";
import { removeCommonAuthorizationToken } from "../helpers/axios";

type WrapperOptions =
  | { isAuth: false; hideInProduction?: boolean }
  | {
      hideInProduction?: boolean;
      isAuth: true;
      redirect?: Redirect;
    };

type WrapperGetServerSideProps = <
  P extends Record<string, unknown> = Record<string, unknown>,
>(
  options: WrapperOptions,
) => (callback: GetServerSideProps<P>) => (
  context: GetServerSidePropsContext,
) => Promise<
  GetServerSidePropsResult<
    P & {
      token?: string | null;
    }
  >
>;
const blackListRedirectWhenHaveTokenUrls = ["/login"];

export const getServerSideProps: WrapperGetServerSideProps =
  options => (callback: CallableFunction) => {
    return async context => {
      const token = context?.req?.cookies?.token || null;
      try{
        if (options?.hideInProduction) {
          if(process?.env?.ORIGIN_ENV === 'production'){
            return {
              notFound: true
            }  
          }
        }
      } catch (err){
        console.log('err 1', err);
        return {
          notFound: true
        } 
      }
      if (options.isAuth && !token) {
        return {
          redirect: {
            destination: `/login?next=${encodeURIComponent(
              context.resolvedUrl,
            )}`,
            permanent: false,
            ...options.redirect,
          },
        };
      } else if (
        options.isAuth === false &&
        token &&
        blackListRedirectWhenHaveTokenUrls.indexOf(context.resolvedUrl) !== -1
      ) {
        return {
          redirect: {
            destination: `/`,
          },
        };
      } else if (
        token === null &&
        blackListRedirectWhenHaveTokenUrls.indexOf(context.resolvedUrl) == -1
      ) {
        return {
          redirect: {
            destination: `/login`,
          },
        };
      }
      const result = await callback(context);

      if ("props" in result) {
        return {
          ...result,
          props: {
            ...result.props,
            token,
          },
        };
      }

      return {
        ...result,
        props: {
          token,
        },
      };
    };
  };
