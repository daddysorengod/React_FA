import "@/styles/globals.css";
import { ReactNode, ReactElement, useMemo } from "react";
import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import {
  store,
} from "@store/store";

import Head from "next/head";

import {
  createTheme,
  ThemeProvider,
  // styled,
  Theme,
} from "@mui/material/styles";

// material-ui
import { StyledEngineProvider } from "@mui/material";
import { ThemeOptions, TypographyVariantsOptions } from "@mui/material/styles";

// project import
import useConfig from "@hooks/useConfig";
import Palette from "@app/configs/palette";
import Typography from "@app/configs/typography";
import CustomShadows from "@app/configs/shadows";
import componentsOverride from "@app/configs/overrides";

// types
import { CustomShadowProps } from "@app/types/theme";
import Snackbar from "@components/@extended/Snackbar";
import Notistack from "@components/third-party/Notistack";
import { NextPage } from "next";
// import { ImagesSvg } from "@/src/constants/images";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

interface Props {
  Component: NextPageWithLayout;
  pageProps: any;
}

const App = ({ Component, pageProps }: AppProps & Props) => {
  const getLayout = Component.getLayout ?? ((page: any) => page);
  const { themeDirection, mode, presetColor, fontFamily } = useConfig();

  const theme: Theme = useMemo<Theme>(
    () => Palette(mode, presetColor),
    [mode, presetColor],
  );

  const themeCustomShadows: CustomShadowProps = useMemo<CustomShadowProps>(
    () => CustomShadows(theme),
    [theme],
  );
  const themeTypography: TypographyVariantsOptions =
    useMemo<TypographyVariantsOptions>(
      () => Typography(mode, fontFamily, theme),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [mode, fontFamily],
    );
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      breakpoints: {
        values: {
          xs: 0,
          sm: 768,
          md: 1024,
          lg: 1266,
          xl: 1440,
        },
      },
      direction: themeDirection,
      mixins: {
        toolbar: {
          minHeight: 60,
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
      palette: theme.palette,
      typography: themeTypography,
      customShadows: themeCustomShadows,
    }),
    [themeDirection, theme, themeCustomShadows, themeTypography],
  );
  const themes: Theme = createTheme(themeOptions);
  themes.components = componentsOverride(themes);
  return (
    <>
      <Head>
        
        <meta name="description" content="Fund admin" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ReduxProvider store={store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={themes}>
            <>
              <Notistack>
                <Snackbar />
                {getLayout(<Component {...pageProps} />)}
              </Notistack>
            </>
          </ThemeProvider>
        </StyledEngineProvider>
      </ReduxProvider>
    </>
  );
};

App.getInitialProps = async ctx => {
  const responseContext = ctx?.ctx?.res;
  console.log("getInitialProps: ",responseContext?.statusCode);
  if (
    responseContext?.statusCode === 404 ||
    responseContext?.statusCode === 500
  ) {
    console.log("Page-not-found");
    return {
      redirect: {
        destination: `/404`,
      },
    };
  }
  // if (
  //   responseContext?.statusCode === 401 
  // ) {
  //   return {
  //     redirect: {
  //       destination: `/login`,
  //     },
  //   };
  // }

  return {};
};
export default App;
