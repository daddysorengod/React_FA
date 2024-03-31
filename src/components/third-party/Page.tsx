import { forwardRef, ReactNode, Ref } from "react";

// next
import Head from "next/head";

// material-ui
import { Box, BoxProps } from "@mui/material";

// ==============================|| Page - SET TITLE & META TAGS ||============================== //

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, Props>(
  (
    { children, title = "", meta, ...other }: Props,
    ref: Ref<HTMLDivElement>,
  ) => (
    <>
      <Head>
        <title>{`${title} | Fund Admin`}</title>
        {meta}
      </Head>

      <Box
        ref={ref}
        {...other}
        sx={{
          // height: "85vh",
          height: "100%"
        }}
      >
        {children}
      </Box>
    </>
  ),
);

export default Page;
