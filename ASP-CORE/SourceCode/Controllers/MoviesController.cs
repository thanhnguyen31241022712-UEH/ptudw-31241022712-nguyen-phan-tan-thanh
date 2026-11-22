using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using _31241022712_NguyenPhanTanThanh.Data;
using _31241022712_NguyenPhanTanThanh.Extension;
using _31241022712_NguyenPhanTanThanh.Models;

namespace _31241022712_NguyenPhanTanThanh.Controllers;

public class MoviesController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _config;

    public MoviesController(
        ApplicationDbContext context,
        IWebHostEnvironment env,
        IConfiguration config)
    {
        _context = context;
        _env = env;
        _config = config;
    }

    private async Task<string> SaveImageAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return null;
        }

        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" }.Contains(ext))
        {
            return null;
        }

        var folder = Path.Combine(_env.WebRootPath, "images");
        Directory.CreateDirectory(folder);

        var fileName = Guid.NewGuid().ToString("N") + ext;

        using var stream = System.IO.File.Create(Path.Combine(folder, fileName));
        await file.CopyToAsync(stream);

        return "/images/" + fileName;
    }

    public async Task<IActionResult> Index()
    {
        var movies = _context.Movies.Include(m => m.GenreObj);
        return View(await movies.ToListAsync());
    }

    public ActionResult AddToCart(int id)
    {
        var movie = _context.Movies.FirstOrDefault(x => x.ID == id);

        if (movie == null)
        {
            return RedirectToAction(nameof(Index));
        }

        var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");

        var chiTietHoaDon = hoaDon.ChiTietHoaDons
            .FirstOrDefault(x => x.MaMovie == id);

        if (chiTietHoaDon == null)
        {
            chiTietHoaDon = new ChiTietHoaDon
            {
                MaMovie = id,
                MovieObj = movie,
                SoLuong = 1
            };

            hoaDon.ChiTietHoaDons.Add(chiTietHoaDon);
        }
        else
        {
            chiTietHoaDon.SoLuong++;
        }

        hoaDon.TongTien = hoaDon.ChiTietHoaDons
            .Sum(x => x.SoLuong * x.MovieObj.Price);

        HttpContext.Session.Set("HoaDon", hoaDon);

        return View(hoaDon);
    }

    public ActionResult RemoveFromCart(int maMovies)
    {
        var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");

        var chiTietHoaDon = hoaDon.ChiTietHoaDons
            .FirstOrDefault(x => x.MaMovie == maMovies);

        if (chiTietHoaDon != null)
        {
            hoaDon.ChiTietHoaDons.Remove(chiTietHoaDon);
        }

        hoaDon.TongTien = hoaDon.ChiTietHoaDons
            .Sum(x => x.SoLuong * x.MovieObj.Price);

        HttpContext.Session.Set("HoaDon", hoaDon);

        return View("AddToCart", hoaDon);
    }

    public ActionResult Checkout()
    {
        return View(new ShippingDetail());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> Checkout(ShippingDetail detail)
    {
        var hoaDon = HttpContext.Session.Get<HoaDon>("HoaDon");

        if (hoaDon.ChiTietHoaDons.Count == 0)
        {
            ModelState.AddModelError("", "Sorry, your cart is empty!");
        }

        if (!ModelState.IsValid)
        {
            return View(detail);
        }

        var order = new HoaDon
        {
            NgayLap = DateTime.Now,
            TongTien = hoaDon.TongTien
        };

        foreach (var ct in hoaDon.ChiTietHoaDons)
        {
            order.ChiTietHoaDons.Add(new ChiTietHoaDon
            {
                MaMovie = ct.MaMovie,
                SoLuong = ct.SoLuong
            });
        }

        _context.HoaDons.Add(order);
        _context.ShippingDetails.Add(detail);
        await _context.SaveChangesAsync();

        Func<string, string> enc = System.Net.WebUtility.HtmlEncode;

        StringBuilder body = new StringBuilder()
            .AppendLine("<p>A new order has been submitted</p><hr />")
            .AppendLine("<p>Items:</p><ul>");

        foreach (var ct in hoaDon.ChiTietHoaDons)
        {
            var subtotal = ct.MovieObj.Price * ct.SoLuong;

            body.AppendLine(
                $"<li>{ct.SoLuong} x {enc(ct.MovieObj.Title)} " +
                $"(subtotal: {subtotal:N0})</li>");
        }

        body.AppendLine("</ul>")
            .AppendLine($"<p>Total order value: {hoaDon.TongTien:N0}</p><hr />")
            .AppendLine(
                $"<p>Ship to:<br/>{enc(detail.Name)}<br/>" +
                $"{enc(detail.Address)}<br/>{enc(detail.Mobile)}</p>");

        var gmail = _config["Email:Address"];
        var appPassword = _config["Email:AppPassword"];

        if (!string.IsNullOrWhiteSpace(gmail) &&
            !string.IsNullOrWhiteSpace(appPassword))
        {
            await EmailServiceNew.SendMailGoogleSmtp(
                gmail,
                detail.Email,
                "New order submitted!",
                body.ToString(),
                gmail,
                appPassword);
        }

        HttpContext.Session.Remove("HoaDon");

        return View("CheckoutCompleted");
    }

    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var movie = await _context.Movies
            .Include(m => m.GenreObj)
            .FirstOrDefaultAsync(m => m.ID == id);

        if (movie == null)
        {
            return NotFound();
        }

        return View(movie);
    }

    public IActionResult Create()
    {
        ViewData["GenreID"] = new SelectList(_context.Genres, "ID", "Name");
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Movie movie)
    {
        movie.Genre = movie.GenreID?.ToString();
        ModelState.Remove(nameof(Movie.Genre));

        if (movie.GenreID == null || !_context.Genres.Any(g => g.ID == movie.GenreID))
        {
            ModelState.AddModelError(nameof(Movie.GenreID), "Vui lòng chọn một thể loại hợp lệ.");
        }

        if (ModelState.IsValid)
        {
            movie.PicturePath =
                await SaveImageAsync(movie.PictureUpload) ?? "/images/no-image.jpg";

            _context.Add(movie);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }

        ViewData["GenreID"] = new SelectList(
            _context.Genres, "ID", "Name", movie.GenreID);

        return View(movie);
    }

    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var movie = await _context.Movies.FindAsync(id);

        if (movie == null)
        {
            return NotFound();
        }

        ViewData["GenreID"] = new SelectList(
            _context.Genres, "ID", "Name", movie.GenreID);

        return View(movie);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, Movie movie)
    {
        if (id != movie.ID)
        {
            return NotFound();
        }

        movie.Genre = movie.GenreID?.ToString();
        ModelState.Remove(nameof(Movie.Genre));

        if (movie.GenreID == null || !_context.Genres.Any(g => g.ID == movie.GenreID))
        {
            ModelState.AddModelError(nameof(Movie.GenreID), "Vui lòng chọn một thể loại hợp lệ.");
        }

        if (ModelState.IsValid)
        {
            try
            {
                var newPath = await SaveImageAsync(movie.PictureUpload);

                if (newPath != null)
                {
                    movie.PicturePath = newPath;
                }
                else if (string.IsNullOrEmpty(movie.PicturePath))
                {
                    movie.PicturePath = "/images/no-image.jpg";
                }

                _context.Update(movie);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(movie.ID))
                {
                    return NotFound();
                }

                throw;
            }

            return RedirectToAction(nameof(Index));
        }

        ViewData["GenreID"] = new SelectList(
            _context.Genres, "ID", "Name", movie.GenreID);

        return View(movie);
    }

    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var movie = await _context.Movies
            .Include(m => m.GenreObj)
            .FirstOrDefaultAsync(m => m.ID == id);

        if (movie == null)
        {
            return NotFound();
        }

        return View(movie);
    }

    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var movie = await _context.Movies.FindAsync(id);

        if (movie != null)
        {
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
        }

        return RedirectToAction(nameof(Index));
    }

    private bool MovieExists(int id)
    {
        return _context.Movies.Any(e => e.ID == id);
    }
}
