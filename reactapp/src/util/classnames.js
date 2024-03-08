function ClassNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default ClassNames;
