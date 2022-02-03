# hikerherd

### Changing the admin password

You need to generate a new caddy password hash from your new password

```
npx caddy hash-password
```

This new password hash can then be added as an environment variable in the render.com dashboard
