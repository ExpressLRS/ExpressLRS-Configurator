import { FunctionComponent, ReactNode } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import BackpackIcon from '@mui/icons-material/Backpack';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import WebIcon from '@mui/icons-material/Web';
import CodeIcon from '@mui/icons-material/Code';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import { SxProps, Theme } from '@mui/system';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import CardTitle from '../../components/CardTitle';
import MainLayout from '../../layouts/MainLayout';
import { Config } from '../../config';
import DiscordIcon from '../../../../assets/DiscordIcon.svg';
import OpenCollectiveIcon from '../../../../assets/OpenCollective.svg';

const ACCENTS = {
  expresslrs: '#a6cf74',
  backpack: '#5f8bf3',
  discord: '#5865f2',
  facebook: '#1877f2',
  github: '#a6cf74',
  openCollective: '#7fadf2',
};

const sectionIntroStyle: SxProps<Theme> = {
  marginBottom: 2,
  color: 'text.secondary',
};

const svgIconStyle: SxProps<Theme> = { width: 32, height: 32 };

interface HomeTileProps {
  icon: ReactNode;
  title: string;
  description: string;
  cta?: string;
  accentColor?: string;
  to?: string;
  href?: string;
}

const HomeTile: FunctionComponent<HomeTileProps> = ({
  icon,
  title,
  description,
  cta,
  accentColor,
  to,
  href,
}) => {
  const actionAreaProps = to
    ? { component: Link, to }
    : {
        component: 'a' as const,
        href,
        target: '_blank',
        rel: 'noreferrer noreferrer',
      };

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(accentColor && {
          borderTop: `3px solid ${accentColor}`,
        }),
        transition: 'background-color 150ms ease',
        '&:hover': {
          backgroundColor: (theme: Theme) => (accentColor
            ? alpha(accentColor, 0.08)
            : theme.palette.action.hover),
        },
      }}
    >
      <CardActionArea
        {...actionAreaProps}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: (theme: Theme) => (accentColor
              ? alpha(accentColor, 0.15)
              : theme.palette.action.selected),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 1.5,
            '& svg': {
              fontSize: 32,
              color: accentColor ?? 'text.primary',
            },
            '& img': {
              width: 32,
              height: 32,
            },
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {cta && (
          <Typography
            variant="body2"
            sx={{ marginTop: 1, fontWeight: 600, color: accentColor ?? 'text.primary' }}
          >
            {cta}
            {' →'}
          </Typography>
        )}
      </CardActionArea>
    </Card>
  );
};

const HomeView: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Card>
        <CardTitle
          icon={<WavingHandIcon />}
          title={t('HomeView.Welcome')}
        />
        <Divider />
        <CardContent>
          <Typography variant="body1">{t('HomeView.Intro')}</Typography>
        </CardContent>

        <Divider />
        <CardTitle
          icon={<FlashOnIcon />}
          title={t('HomeView.Flash.Title')}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<SettingsInputAntennaIcon />}
                title={t('HomeView.Flash.ExpressLRS')}
                description={t('HomeView.Flash.ExpressLRSDescription')}
                accentColor={ACCENTS.expresslrs}
                to="/configurator"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<BackpackIcon />}
                title={t('HomeView.Flash.Backpack')}
                description={t('HomeView.Flash.BackpackDescription')}
                accentColor={ACCENTS.backpack}
                to="/backpack"
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />
        <CardTitle
          icon={<MenuBookIcon />}
          title={t('HomeView.Resources.Title')}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<RocketLaunchIcon />}
                title={t('HomeView.Resources.GettingStarted')}
                description={t('HomeView.Resources.GettingStartedDescription')}
                href={Config.gettingStartedUrl}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<DevicesOtherIcon />}
                title={t('HomeView.Resources.ProductFinder')}
                description={t('HomeView.Resources.ProductFinderDescription')}
                href={Config.productFinderUrl}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<WebIcon />}
                title={t('HomeView.Resources.Documentation')}
                description={t('HomeView.Resources.DocumentationDescription')}
                href={Config.documentationUrl}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<CodeIcon />}
                title={t('HomeView.Resources.LuaScripts')}
                description={t('HomeView.Resources.LuaScriptsDescription')}
                href={Config.luaScriptsUrl}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />
        <CardTitle
          icon={<GroupsIcon />}
          title={t('HomeView.Community.Title')}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" sx={sectionIntroStyle}>
            {t('HomeView.Community.Subtitle')}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={(
                  <Box component="img" src={DiscordIcon} alt="" sx={svgIconStyle} />
                )}
                title={t('HomeView.Community.Discord')}
                description={t('HomeView.Community.DiscordDescription')}
                cta={t('HomeView.Community.JoinDiscord')}
                accentColor={ACCENTS.discord}
                href={Config.discordUrl}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<FacebookIcon />}
                title={t('HomeView.Community.Facebook')}
                description={t('HomeView.Community.FacebookDescription')}
                cta={t('HomeView.Community.JoinGroup')}
                accentColor={ACCENTS.facebook}
                href={Config.facebookGroupUrl}
              />
            </Grid>
          </Grid>
        </CardContent>

        <Divider />
        <CardTitle
          icon={<FavoriteIcon />}
          title={t('HomeView.Support.Title')}
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" sx={sectionIntroStyle}>
            {t('HomeView.Support.Subtitle')}
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={<GitHubIcon />}
                title={t('HomeView.Support.GitHub')}
                description={t('HomeView.Support.GitHubDescription')}
                cta={t('HomeView.Support.Contribute')}
                accentColor={ACCENTS.github}
                href={Config.githubRepositoryUrl}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <HomeTile
                icon={(
                  <Box
                    component="img"
                    src={OpenCollectiveIcon}
                    alt=""
                    sx={svgIconStyle}
                  />
                )}
                title={t('HomeView.Support.OpenCollective')}
                description={t('HomeView.Support.OpenCollectiveDescription')}
                cta={t('HomeView.Support.SupportProject')}
                accentColor={ACCENTS.openCollective}
                href={Config.openCollectiveUrl}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default HomeView;
