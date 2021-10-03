class Utils
{
  static Append_Str(a, b, sep)
  {
    let res = null;

    if (sep == null || sep == undefined)
    {
      sep = "";
    }
    if (a && b && a.length > 0 && b.length > 0)
    {
      res = a + sep + b;
    } else if (a && !b && a.length > 0)
    {
      res = a;
    } else if (!a && b && b.length > 0)
    {
      res = b;
    }

    return res;
  }
}

module.exports = Utils;