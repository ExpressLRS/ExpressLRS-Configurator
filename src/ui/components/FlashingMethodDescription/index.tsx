import React, { FunctionComponent } from 'react';
import { Box, Tooltip } from '@mui/material';
import QuestionIcon from '@mui/icons-material/Help';
import { SxProps, Theme } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { FlashingMethod } from '../../gql/generated/types';
import DocumentationLink from '../DocumentationLink';

const styles: Record<string, SxProps<Theme>> = {
  root: {
    display: 'inline-block',
  },
  icon: {
    verticalAlign: 'middle',
    marginLeft: '5px',
    fontSize: '1.44em',
  },
};

interface FlashingMethodDescriptionProps {
  flashingMethod: FlashingMethod;
  deviceWikiUrl: string | null;
}

const FlashingMethodDescription: FunctionComponent<
  FlashingMethodDescriptionProps
> = ({ flashingMethod, deviceWikiUrl }) => {
  const wikiUrl = (deviceWikiUrl ?? '').length > 0 ? deviceWikiUrl : null;
  const { t } = useTranslation();

  const toText = (key: FlashingMethod) => {
    switch (key) {
      case FlashingMethod.BetaflightPassthrough:
        return (
          <div>
            <p>
              {t('FlashingMethodDescription.BetaflightPassthroughDescription')}
            </p>
            <ol>
              <li>{t('FlashingMethodDescription.PlugInFCToComputer')}</li>
              <li>{t('FlashingMethodDescription.SelectDesiredDevice')}</li>
              <li>{t('FlashingMethodDescription.RunBuild&Flash')}</li>
            </ol>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/software/updating/betaflight-passthrough/'
                }
              >
                {t('FlashingMethodDescription.BetaflightPassthroughWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.DFU:
        return (
          <div>
            <p>{t('FlashingMethodDescription.DFU')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/quick-start/getting-started/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.STLink:
        return (
          <div>
            <p>{t('FlashingMethodDescription.STLink')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/quick-start/getting-started/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.Stock_BL:
        return (
          <div>
            <p>{t('FlashingMethodDescription.StockBL')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/quick-start/getting-started/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.UART:
        return (
          <div>
            <p>{t('FlashingMethodDescription.UART')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/quick-start/getting-started/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.WIFI:
        return (
          <div>
            <p>{t('FlashingMethodDescription.WIFI')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/software/updating/wifi-updating/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.EdgeTxPassthrough:
        return (
          <div>
            <p>{t('FlashingMethodDescription.EdgeTxPassthrough')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/quick-start/getting-started/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      case FlashingMethod.Passthrough:
        return (
          <div>
            <p>{t('FlashingMethodDescription.Passthrough')}</p>
            <p>
              <DocumentationLink
                url={
                  wikiUrl ??
                  'https://www.expresslrs.org/quick-start/getting-started/'
                }
              >
                {t('FlashingMethodDescription.GeneralWiki')}
              </DocumentationLink>
            </p>
          </div>
        );
      default:
        return '';
    }
  };
  const desc = toText(flashingMethod);
  return (
    <Box sx={styles.root}>
      {desc !== '' && (
        <Tooltip placement="top" arrow title={<div>{desc}</div>}>
          <QuestionIcon sx={styles.icon} />
        </Tooltip>
      )}
    </Box>
  );
};

export default FlashingMethodDescription;
