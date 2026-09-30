enum FirmwareOutputMode {
  /** firmware stays in the temporary folder it was built in */
  TemporaryFolder = 'temporary_folder',
  /** ask for a destination folder after every build (default) */
  AskEveryTime = 'ask_every_time',
  /** always copy the firmware into a folder configured by the user */
  FixedFolder = 'fixed_folder',
}

export default FirmwareOutputMode;
