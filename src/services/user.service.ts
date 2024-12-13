import prisma from "../prisma";

export const findUser = async (username: string, email: string) => {
  const user = await prisma.user.findFirst({
    where: { OR: [{ username: username }, { email: email }] },
  });
  return user;
};

export const findReferralCode = async (referralCode: string) => {
  const refferedCode = await prisma.user.findFirst({
    where: { refCode: referralCode },
  })
  return refferedCode
}
