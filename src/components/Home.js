import React, { useEffect, useRef, useState } from "react";
import { Hidden, makeStyles, Typography } from "@material-ui/core";
import {
  Card,
  CardActions,
  IconButton,
  Grid,
  CircularProgress,
  Box,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";

import Navbar from "./Navbar";

import { fetchImages } from "../helper/apiCall";
import { AccountCircleRounded } from "@material-ui/icons";

const useStyle = makeStyles((props) => {
  return {
    memes: {
      marginTop: props.spacing(4),
    },
    memeCard: {
      width: "100%",
      marginBottom: props.spacing(4),
    },
    memeHeader: {
      padding: "15px 20px",
      alignItems: "center",
      alignContent: "center",
    },
    memeTitle: {
      marginLeft: "10px",
    },
    spinnerWrap: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
  };
});

const Home = () => {
  // States
  const [memes, setMemes] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // seed for rand(seed) in backend's mysql query. Random integer 0 ~ 9999
  const [seed, setSeed] = useState(Math.floor(Math.random() * 9999));
  const [endOfPage, setEndOfPage] = useState(false);

  // Style
  const classes = useStyle();

  // Functions
  const stripExt = (fileName) => {
    const dotIdx = fileName.lastIndexOf(".");

    return fileName.substring(0, dotIdx);
  };

  const getDiffFromNow = (date) => {
    if (!date) return;

    const miliDiff = new Date().getTime() - new Date(date).getTime();

    const dayDiff = Math.floor(miliDiff / 1000 / 60 / 60 / 24);
    if (dayDiff >= 1) return dayDiff + "d";

    const hourDiff = Math.floor(miliDiff / 1000 / 60 / 60);
    if (hourDiff >= 1) return hourDiff + "h";

    const minDiff = Math.floor(miliDiff / 1000 / 60);
    if (minDiff >= 1) return minDiff + "min";

    return "just now";
  };

  const fetchData = async () => {
    if (!endOfPage) {
      setIsLoading(true);

      const newMemes = await fetchImages(seed, pageNo);

      if (newMemes.length === 0) {
        setEndOfPage(true);
        setIsLoading(false);
        return;
      }

      setMemes((prevMemes) => [...prevMemes, ...newMemes]);

      setIsLoading(false);
    }
  };

  const onScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight)
      setPageNo((prevPageNo) => prevPageNo + 1);
  };

  // Hooks
  useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchData();
  }, [pageNo]);

  console.log(memes);

  return (
    <>
      <Navbar />

      <Grid container className={classes.memes}>
        <Grid item xs={1} sm={3} />

        <Grid item container xs={10} sm={6}>
          {memes.map((item, idx) => (
            <Card className={classes.memeCard} key={idx}>
              <Grid
                item
                container
                alignItems="center"
                justify="center"
                className={classes.memeHeader}
              >
                <Grid item container xs={12} sm={10} alignItems="center">
                  <Hidden xsDown>
                    <AccountCircleRounded fontSize="large" />
                  </Hidden>
                  <Typography
                    variant="h6"
                    noWrap={true}
                    className={classes.memeTitle}
                  >
                    admin
                  </Typography>
                </Grid>

                <Grid
                  item
                  container
                  xs={false}
                  sm={2}
                  alignItems="center"
                  justify="flex-end"
                >
                  <Hidden xsDown>
                    <Typography variant="body1">
                      {getDiffFromNow(item.createdAt)}
                    </Typography>
                  </Hidden>
                </Grid>
              </Grid>

              <img src={item.url} alt="" style={{ width: "100%" }} />

              <CardActions>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}

          {isLoading && (
            <Box className={classes.spinnerWrap}>
              <CircularProgress />
            </Box>
          )}
        </Grid>

        <Grid item xs={1} sm={3} />
      </Grid>
    </>
  );
};

export default Home;
