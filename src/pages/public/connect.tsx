import { FC } from "react";
import { useMoralis } from "react-moralis";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";
import MetamaskLogo from "../../assets/wallet/metamask.svg";
import { useSnackbar } from "notistack";

enum AuthenticationType {
  METAMASK = "metamask",
  WALLETCONNECT = "walletconnect",
  COINBASE = "coinbase",
}

const Connect: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { authenticate } = useMoralis();
  const navigate = useNavigate();

  /**
   * @description Handle Wallet authentication
   *
   * @param {AuthenticationType} type - Wallet type (Metamask, WalletConnect, etc.)
   */
  const onAuthentication = async (type: AuthenticationType) => {
    authenticate({
      signingMessage: "Metaverse Authentication",
      onSuccess: () => navigate("/"),
      onError: () =>
        enqueueSnackbar("Failed to connect with Metamask", {
          variant: "error",
        }),
    });
  };

  return (
    <Grid
      container
    >
      <Grid
        item
        position='fixed'
        top={30}
        left={30}
        sx={{
          transform: "scale(0.6)",
        }}
      >
      </Grid>

      <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
        sx={{
          height: "100vh",
        }}
      >
        <Box
          sx={{
            width: "370px",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
            background: "#2D325A",
            borderRadius: "24px",
            padding: "28px 30px",
            color: "white",
          }}
        >
          <Grid
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant='caption'
              fontSize='22px'
              lineHeight='33px'
              align='center'
              marginTop='53px'
              mb={3}
            >
              Metaverse
            </Typography>
            <Grid item mt={1}>
              <Button
                onClick={() => onAuthentication(AuthenticationType.METAMASK)}
                color='inherit'
                variant='outlined'
                fullWidth
                sx={{ minWidth: "300px", minHeight: "56px", borderRadius: "20px" }}
              >
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid item xs={12} sx={{ pt: 1 }}>
                    <img
                      src={MetamaskLogo}
                      alt='Metamask'
                      height='40px'
                      width='auto'
                      style={{ marginRight: "0.5rem" }}
                    />
                  </Grid>
                </Grid>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Connect;
