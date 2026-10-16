
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        ok: false,
        message: "Your account is inactive",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      config.SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Login failed",
    });
  }
};
