import { FC, useEffect, useRef, useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MetalandImage from "../../assets/Metaland.png";
import _ from "lodash";
import { useMoralis } from "react-moralis";
import { useSnackbar } from "notistack";
import metalandABI from "../../assets/metalandABI.json";

type DirectionProps = 'ArrowRight' | 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | undefined;

const Metaverse: FC = () => {
    const { enableWeb3, isWeb3Enabled, Moralis } = useMoralis();
    const { enqueueSnackbar } = useSnackbar();
    const tiles = 12;
    const plots = tiles * 9;
    const roads = tiles * 2;
    const initialOffsets = plots + roads;
    const plotViewOffsets = plots + (2 * roads);
    const mainCanvas = useRef<HTMLCanvasElement | null>(null);
    const plotCanvas = useRef<HTMLCanvasElement | null>(null);
    const [isClaimable, setIsClaimable] = useState<boolean>(false);
    const [plotId, setPlotId] = useState<string>("");
    const [mapView, setMapView] = useState({
        mapOffsetX: -1 * initialOffsets,
        mapOffsetY: -1 * initialOffsets
    });
    const [plotView, setPlotView] = useState({
        plotX: 0,
        plotY: 0,
        locationX: 0,
        locationY: 0,
    });
    const metalandContractAddress = "0xb5F257d4a83fE43401a5974e60d3004c2aC53734";

    const worldImage = new Image();
    worldImage.src = MetalandImage;

    const unassignables = [
        "0x8fa5a0f171f8b06a2006bc8fa5164606fa303f29b43f25438ae585d32f979524",
        "0x51335e5c0d362b12bbc4877297443f914f0f9849da3bb43485ce6d96fcc6f9c9",
        "0xbb15fe082bb44a75feb18fcb4072d7e1d817f016d24cc1b1205c4f729e0b69ca",
        "0x5e2da10292384f87396bd6e706838dcb931f91404f3f01e4ef9538f3e161262e",
        "0x760a8a1da896267c45023b0d1c17a5bc42b81d12ab49a4bf1ccfec74c1ebe8ae",
        "0xad2572137374014c87d7abe24a591d3d65aee5cdc781ae15c727a971c5637aa7",
        "0xc2c26eb9355dec9ceae980da9bb626c7b583fe9af9c779333ea6e19309c2f3a6",
        "0xbf8142b3eb80adcbdb8a1c1a146995728a859ab1a1dbf29dcf15ebeb32f4a468",
        "0x3c02bccec034096f69ebbaacc075adbf352d2309a6de6b632d7b18b10b60180c",
        "0xfaf95d6bec5226ee145a021be8bda12c1062f7817ba6340499023b26d7e7a3f0",
        "0x98ce6651c1676f0d20fc0553d96755f2162f97c874ec668be5ebc68c3b2b7b41"
    ];

    const drawCanvas = () => {
        const _mainCanvas: any = mainCanvas.current;
        const _plotCanvas: any = plotCanvas.current;

        if (_mainCanvas && _plotCanvas) {
            _mainCanvas.width = 3 * plots + 4 * roads;
            _mainCanvas.height = 3 * plots + 4 * roads;
            _plotCanvas.width = plots
            _plotCanvas.height = plots
            worldImage.onload = () => {
                initializeMap();
            }
        }
    }

    const initializeMap = () => {
        const mainCtx = mainCanvas.current?.getContext('2d');
        const plotCtx = plotCanvas.current?.getContext('2d');

        if (mainCtx && plotCtx) {
            updatePlotLocation();
            drawMapSection(mainCtx, mapView.mapOffsetX, mapView.mapOffsetY);
            drawCursor(plotViewOffsets, plotViewOffsets);
        }
    }

    const move = (direction: DirectionProps) => {
        const mainCtx = mainCanvas.current?.getContext('2d');
        const plotCtx = plotCanvas.current?.getContext('2d');
        const validMove = validateMove(direction);

        if (mainCtx && plotCtx && validMove) {
            updateView(direction);
            updatePlotLocation();
            drawMapSection(mainCtx, mapView.mapOffsetX, mapView.mapOffsetY);
            drawCursor(plotViewOffsets, plotViewOffsets);
        }
    }

    const validateMove = (direction: DirectionProps) => {
        switch (direction) {
            case 'ArrowRight': return !(plotView.plotX === 5);
            case 'ArrowUp': return !(plotView.plotY === 0);
            case 'ArrowLeft': return !(plotView.plotX === 0);
            case 'ArrowDown': return !(plotView.plotY === 5);
        }
    }

    const updateView = (direction: DirectionProps) => {
        let _plotView = plotView;
        let _mapView = mapView;
        switch (direction) {
            case 'ArrowRight':
                _plotView.plotX += 1;
                _mapView.mapOffsetX -= plots + roads;
                break
            case 'ArrowDown':
                _plotView.plotY += 1;
                _mapView.mapOffsetY -= plots + roads;
                break
            case 'ArrowLeft':
                _plotView.plotX -= 1;
                _mapView.mapOffsetX += plots + roads;
                break
            case 'ArrowUp':
                _plotView.plotY -= 1;
                _mapView.mapOffsetY += plots + roads;
                break
        }
        setPlotView(_plotView);
        setMapView(_mapView);
    }

    const drawMapSection = (ctx: any, originX: number, originY: number) => {
        ctx.drawImage(worldImage, originX, originY);
    }

    const drawCursor = (x: number, y: number) => {
        const mainCtx = mainCanvas.current?.getContext('2d');

        if (mainCtx) {
            mainCtx.strokeRect(x, y, plots, plots);
        }
    }

    const updatePlotLocation = () => {
        setPlotView((prevState) => ({
            ...prevState,
            locationX: -1 * mapView.mapOffsetX + plotViewOffsets,
            locationY: -1 * mapView.mapOffsetY + plotViewOffsets,
        }));
    }

    const assignPlot = async () => {
        const assigned = await isPlotAssigned(plotId);
        if (assigned) {
            enqueueSnackbar("Plot is already assigned");
        }
        else {
            enqueueSnackbar("Plot is available");
            const plotCtx = plotCanvas.current?.getContext('2d');
            if (plotCtx) {
                const metadata = {
                    "PlotID": plotId,
                    "PlotX": plotView.plotX,
                    "PlotY": plotView.plotY,
                    "LocationX": plotView.locationX,
                    "LocationY": plotView.locationX,
                    "image": plotCanvas.current?.toDataURL(),
                }
                const metadataFile = new Moralis.File("metadata.json", { base64: btoa(JSON.stringify(metadata)) });
                await metadataFile.saveIPFS();
                const metadataURI = metadataFile.ipfs();
                await mint(metadataURI);
            }
        }
    }

    const mint = async (_tokenURI: string) => {
        try {
            const transaction = await Moralis.executeFunction({
                contractAddress: metalandContractAddress,
                abi: metalandABI,
                functionName: "assign",
                params: {
                    tokenURI: _tokenURI,
                    bytesId: plotId,
                }
            });
            enqueueSnackbar("Transaction confirmed with hash " + transaction.hash);
        }
        catch (error: any) {
            enqueueSnackbar(error?.data?.message || error?.message || error || "Transaction Unsuccessful", {
                variant: "error",
            });
        }
    }

    const isPlotAssigned = async (plotId: string) => {
        try {
            return await Moralis.executeFunction({
                contractAddress: metalandContractAddress,
                abi: metalandABI,
                functionName: "exist",
                params: {
                    bytesId: plotId,
                }
            });
        } catch (error: any) {
            enqueueSnackbar(error?.data?.message || error?.message || error || "Transaction Unsuccessful", {
                variant: "error",
            });
        }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        move(e.key as DirectionProps);
    };

    useEffect(() => {
        setIsClaimable(unassignables.includes(plotId));
    }, [plotId]);

    useEffect(() => {
        const plotCtx = plotCanvas.current?.getContext('2d');
        setPlotId(Moralis.web3Library.utils.id(JSON.stringify(plotView)));
        if (plotCtx) {
            drawMapSection(plotCtx, -1 * plotView.locationX, -1 * plotView.locationY);
        }
    }, [plotView]);

    useEffect(() => {
        if (!isWeb3Enabled) {
            enableWeb3();
        }
    }, [enableWeb3, isWeb3Enabled]);

    useEffect(() => {
        drawCanvas();
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    return (
        <Grid container spacing={4} alignItems="center">
            <Grid item xs={6}
                sx={{
                    textAlign: "center"
                }}
            >
                <canvas ref={mainCanvas}></canvas>
            </Grid>
            <Grid item xs={6}>
                <Typography>Current Plot</Typography>
                <canvas ref={plotCanvas}></canvas>
                <Box sx={{ ml: -2 }}>
                    <TextField
                        label="Plot ID"
                        value={plotId}
                        sx={{ m: 2 }}
                    />
                    <TextField
                        label="Plot X"
                        value={plotView.plotX}
                        sx={{ m: 2 }}
                    />
                    <TextField
                        label="Plot Y"
                        value={plotView.plotY}
                        sx={{ m: 2 }}
                    />
                    <TextField
                        label="Location X"
                        value={plotView.locationX}
                        sx={{ m: 2 }}
                    />
                    <TextField
                        label="Location Y"
                        value={plotView.locationY}
                        sx={{ m: 2 }}
                    />
                </Box>
                <Button
                    variant="contained"
                    disabled={isClaimable}
                    onClick={() => {
                        assignPlot();
                    }}
                >Claim</Button>
            </Grid>
        </Grid>
    )
}

export default Metaverse;
